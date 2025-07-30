// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin işlemleri için service role client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Utility functions
export const getCurrentUser = async () => {
  if (typeof window === 'undefined') return null
  
  const userId = localStorage.getItem('apartment_user_id')
  if (!userId) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return error ? null : data
}

export const loginUser = async (apartmentNumber, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('apartment_number', apartmentNumber)
    .eq('password', password)
    .single()

  if (error || !data) {
    return { success: false, error: 'Daire numarası veya şifre hatalı' }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('apartment_user_id', data.id.toString())
  }

  return { success: true, user: data }
}

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('apartment_user_id')
  }
}

export const getUserPayments = async (userId) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('payment_date', { ascending: false })

  return { data: data || [], error }
}

export const calculateUserBalance = async (userId) => {
  const user = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  const payments = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)

  const additionalFees = await supabase
    .from('additional_fees')
    .select('*')
    .eq('user_id', userId)

  const monthlyParams = await supabase
    .from('monthly_parameters')
    .select('*')

  if (user.error || payments.error) {
    return { error: 'Veri alınamadı' }
  }

  const currentDate = new Date()
  const startDate = new Date(2024, 10) // Kasım 2024'ten başla (index 10 = Kasım)
  
  let totalOwed = 0
  let totalPaid = payments.data?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0

  // Her ay için borç hesapla
  for (let date = new Date(startDate); date <= currentDate; date.setMonth(date.getMonth() + 1)) {
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    
    let monthlyFee = parseFloat(user.data.monthly_fee)
    
    // Ay bazında ek ücret var mı kontrol et
    const monthlyParam = monthlyParams.data?.find(p => p.fee_month === month && p.fee_year === year)
    if (monthlyParam) {
      monthlyFee += parseFloat(monthlyParam.additional_amount)
    }
    
    // Kullanıcı bazında ek ücret var mı kontrol et
    const userAdditionalFee = additionalFees.data?.find(f => f.fee_month === month && f.fee_year === year)
    if (userAdditionalFee) {
      monthlyFee += parseFloat(userAdditionalFee.amount)
    }
    
    totalOwed += monthlyFee
  }

  const balance = totalPaid - totalOwed

  return {
    totalOwed,
    totalPaid,
    balance,
    user: user.data
  }
}