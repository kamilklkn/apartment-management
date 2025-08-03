// pages/index.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser } from '../lib/supabase'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      // Kullanıcı giriş yapmış, dashboard'a yönlendir
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Apartman Aidat Takip Sistemi
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Apartman aidatlarını kolayca takip edin ve ödemelerinizi yönetin.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Giriş Yap
        </Link>
      </section>
    </Layout>
  )
}
