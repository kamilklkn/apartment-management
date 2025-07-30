// pages/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { loginUser } from '../lib/supabase'

export default function Login() {
  const [apartmentNumber, setApartmentNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginUser(parseInt(apartmentNumber), password)
      
      if (result.success) {
        // Admin kontrolü
        if (apartmentNumber === '999' && password === 'admin123') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-1a1 1 0 011-1h2a1 1 0 011 1v1m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v12M9 7h6" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Apartman Aidat Sistemi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Daire numaranız ve şifrenizle giriş yapın
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="apartment-number" className="block text-sm font-medium text-gray-700">
                Daire Numarası
              </label>
              <input
                id="apartment-number"
                name="apartment-number"
                type="number"
                required
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Örn: 1, 2, 3..."
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Şifrenizi girin"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Varsayılan şifre: <code className="bg-gray-100 px-2 py-1 rounded">apartment123</code></p>
              <p className="text-xs text-gray-500">
                Admin girişi için: Daire numarası <code>999</code>, Şifre <code>admin123</code>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}