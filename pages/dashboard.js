/ pages/dashboard.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser } from '../lib/supabase'
import UserDashboard from '../components/UserDashboard'
import Login from './login'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    } else {
      router.push('/login')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <UserDashboard user={user} />
}