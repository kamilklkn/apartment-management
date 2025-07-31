// pages/admin.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminPanel from '../components/AdminPanel'

export default function Admin() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    // Basit admin kontrolü - gerçek uygulamada daha güvenli olmalı
    const isAdmin = localStorage.getItem('apartment_user_id') === '999' || 
                   router.query.admin === 'true'
    
    if (isAdmin) {
      setAuthorized(true)
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

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600 mb-4">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    )
  }

  return <AdminPanel />
}
