/ pages/api/auth.js
import { supabaseAdmin } from '../../lib/supabase'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { apartmentNumber, password } = req.body

  try {
    // Admin kontrolü
    if (apartmentNumber === 999 && password === 'admin123') {
      return res.status(200).json({ 
        success: true, 
        user: { id: 999, apartment_number: 999, name: 'Admin', surname: 'User' },
        isAdmin: true 
      })
    }

    // Normal kullanıcı kontrolü
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('apartment_number', apartmentNumber)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Daire numarası bulunamadı' })
    }

    // Şifre kontrolü (şu an için basit string karşılaştırması)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Şifre hatalı' })
    }

    res.status(200).json({ success: true, user, isAdmin: false })

  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}