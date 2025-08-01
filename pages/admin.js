// pages/admin.js - User Type sistemine göre güncellenmiş
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, isAdmin } from '../lib/supabase'
import AdminPanel from '../components/AdminPanel'

export default function Admin() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Önce localStorage'dan kontrol et
      const userType = localStorage.getItem('user_type')
      const isAdminFlag = localStorage.getItem('is_admin')
      
      // Sonra veritabanından kullanıcıyı al
      const user = await getCurrentUser()
      
      console.log('Admin check:', { 
        user, 
        userType, 
        isAdminFlag, 
        isAdminUser: user ? isAdmin(user) : false 
      })
      
      if (user && isAdmin(user)) {
        setCurrentUser(user)
        setAuthorized(true)
      } else if (userType === 'admin' || userType === 'manager' || isAdminFlag === 'true') {
        // localStorage'da admin bilgisi var ama veritabanında yok, temizle
        localStorage.removeItem('apartment_user_id')
        localStorage.removeItem('user_type')
        localStorage.removeItem('is_admin')
        router.push('/login')
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('apartment_user_id')
    localStorage.removeItem('user_type')
    localStorage.removeItem('is_admin')
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid #ffffff20',
            borderTop: '4px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
            Yetki kontrolü yapılıyor...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '28rem',
          width: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            margin: '0 auto 1.5rem',
            height: '4rem',
            width: '4rem',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{ height: '2rem', width: '2rem', color: '#dc2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Yetkisiz Erişim
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Bu sayfaya erişim yetkiniz bulunmamaktadır. Admin veya Manager hesabı ile giriş yapmanız gerekir.
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                height: '2.5rem',
                width: '2.5rem',
                background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem'
              }}>
                <svg style={{ height: '1.5rem', width: '1.5rem', color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Admin Paneli
                </h1>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {currentUser?.name} {currentUser?.surname} ({currentUser?.user_type === 'admin' ? 'Sistem Yöneticisi' : 'Yönetici'})
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => window.open('/', '_blank')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
              >
                <svg style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ana Sayfa
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  color: '#ffffff',
                  backgroundColor: '#dc2626',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                <svg style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Content */}
      <AdminPanel currentUser={currentUser} />
    </div>
  )
}