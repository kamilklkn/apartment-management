// pages/api/parameters.js
import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data: monthlyParams } = await supabaseAdmin
        .from('monthly_parameters')
        .select('*')
        .order('fee_year', { ascending: false })
        .order('fee_month', { ascending: false })

      const { data: additionalFees } = await supabaseAdmin
        .from('additional_fees')
        .select('*, users(name, surname, apartment_number)')
        .order('created_at', { ascending: false })

      res.status(200).json({ monthlyParams, additionalFees })

    } else if (req.method === 'POST') {
      const { type, ...data } = req.body

      if (type === 'monthly_parameter') {
        const { error } = await supabaseAdmin
          .from('monthly_parameters')
          .upsert({
            fee_month: parseInt(data.fee_month),
            fee_year: parseInt(data.fee_year),
            additional_amount: parseFloat(data.additional_amount),
            description: data.description
          })

        if (error) throw error
        
      } else if (type === 'additional_fee') {
        const { error } = await supabaseAdmin
          .from('additional_fees')
          .insert({
            user_id: parseInt(data.user_id),
            amount: parseFloat(data.amount),
            description: data.description,
            fee_month: parseInt(data.fee_month),
            fee_year: parseInt(data.fee_year)
          })

        if (error) throw error
      }

      res.status(200).json({ success: true })

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Parameters API error:', error)
    res.status(500).json({ error: error.message })
  }
}
