// pages/api/users.js
import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('apartment_number')

      if (error) throw error
      res.status(200).json({ users })

    } else if (req.method === 'PUT') {
      const { userId, monthlyFee } = req.body

      const { error } = await supabaseAdmin
        .from('users')
        .update({ monthly_fee: parseFloat(monthlyFee) })
        .eq('id', userId)

      if (error) throw error
      res.status(200).json({ success: true })

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Users API error:', error)
    res.status(500).json({ error: error.message })
  }
}