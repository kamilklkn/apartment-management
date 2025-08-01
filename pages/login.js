// pages/login.js - User Type sistemine göre güncellenmiş
import { useState } from 'react'
import { useRouter } from 'next/router'
import { loginUser, isAdmin } from '../lib/supabase'

// Phoenix Icon Component
function PhoenixIcon() {
  return (
    <div style={{ 
      position: 'relative', 
      width: '3.5rem', 
      height: '3.5rem', 
      margin: '0 auto' 
    }}>
      <svg
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%' 
        }}
        fill="none"
        preserveAspectRatio="none"
        role="presentation"
        viewBox="0 0 56 56"
      >
        <circle cx="28" cy="28" r="28" fill="#2B303B" />
        <circle cx="28" cy="20" r="8" fill="url(#paint0_linear)" fillOpacity="0.32" />
        <circle cx="28" cy="32" r="12" fill="url(#paint1_linear)" fillOpacity="0.8" />
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint0_linear"
            x1="40"
            x2="16"
            y1="12"
            y2="28"
          >
            <stop offset="0.313079" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint1_linear"
            x1="40"
            x2="16"
            y1="24"
            y2="40"
          >
            <stop offset="0.313079" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Eye Icon Component
function EyeIcon({ onClick, showPassword }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        width: '1.25rem',
        height: '1.25rem',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        transition: 'opacity 0.3s'
      }}
      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
      onMouseLeave={(e) => e.target.style.opacity = '1'}
    >
      <svg
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%' 
        }}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        {showPassword ? (
          <path
            d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"
            fill="#99A0AE"
          />
        ) : (
          <path
            d="M2.5 2.5l15 15M10 6.5a3.5 3.5 0 013.5 3.5M10 6.5V10m0-3.5a3.5 3.5 0 00-3.5 3.5M10 10v3.5m0-3.5h3.5M10 13.5a3.5 3.5 0 01-3.5-3.5M10 13.5h-3.5"
            stroke="#99A0AE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

export default function Login() {
  const [apartmentNumber, setApartmentNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {}

    if (!apartmentNumber) {
      newErrors.apartmentNumber = "Apartment number is required"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError('')

    try {
      // Veritabanından kullanıcı doğrulama
      const result = await loginUser(parseInt(apartmentNumber), password)
      
      if (result.success) {
        const user = result.user
        
        // User type'a göre yönlendirme
        if (isAdmin(user)) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert("Password reset functionality would be implemented here")
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '1rem',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          width: '100%',
          maxWidth: '24rem'
        }}
      >
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e1e4ea'
        }}>
          
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <PhoenixIcon />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: '500',
                color: '#0e121b',
                margin: '0 0 0.5rem 0',
                lineHeight: '1.75rem',
                fontFamily: "'Inter', sans-serif"
              }}>
                Welcome back
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#525866',
                margin: 0,
                lineHeight: '1.25rem',
                letterSpacing: '-0.084px',
                fontFamily: "'Inter', sans-serif"
              }}>
                Please enter your details to login.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem'
            }}>
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                textAlign: 'center',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            
            {/* Apartment Number */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#0e121b',
                marginBottom: '0.5rem',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.084px'
              }}>
                Apartment Number
              </label>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.625rem',
                border: errors.apartmentNumber ? '1px solid #ef4444' : '1px solid #e1e4ea',
                boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.625rem 0.75rem'
                }}>
                  <input
                    type="number"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    placeholder="Enter apartment number"
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.875rem',
                      color: '#0e121b',
                      letterSpacing: '-0.084px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '400'
                    }}
                  />
                </div>
              </div>
              {errors.apartmentNumber && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.apartmentNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#0e121b',
                marginBottom: '0.5rem',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.084px'
              }}>
                Password
              </label>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.625rem',
                border: errors.password ? '1px solid #ef4444' : '1px solid #e1e4ea',
                boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.625rem 0.75rem',
                  gap: '0.5rem'
                }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.875rem',
                      color: '#0e121b',
                      letterSpacing: '-0.084px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '400'
                    }}
                  />
                  <EyeIcon onClick={() => setShowPassword(!showPassword)} showPassword={showPassword} />
                </div>
              </div>
              {errors.password && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.875rem'
            }}>
              <span style={{
                color: '#525866',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '400',
                letterSpacing: '-0.084px'
              }}>
                Forgot password?
              </span>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  color: '#335cff',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '500',
                  letterSpacing: '-0.084px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.875rem'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Reset it
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#335cff',
              color: '#ffffff',
              fontWeight: '500',
              padding: '0.75rem 1rem',
              borderRadius: '0.625rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.084px',
              boxShadow: '0px 1px 2px 0px rgba(14, 18, 27, 0.24), 0px 0px 0px 1px #335cff'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2a4fd7'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#335cff'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Info Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Resident Info */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #dbeafe',
              borderRadius: '0.5rem',
              padding: '0.75rem'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#1d4ed8'
              }}>
                <p style={{
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  margin: '0 0 0.25rem 0'
                }}>
                  👤 Resident Login
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <span style={{ fontWeight: '500' }}>Apartment:</span> 1, 2, 3, 4, 5, 6
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <span style={{ fontWeight: '500' }}>Password:</span> apartment123
                </p>
              </div>
            </div>

            {/* Admin Info */}
            <div style={{
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: '0.5rem',
              padding: '0.75rem'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#7c3aed'
              }}>
                <p style={{
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  margin: '0 0 0.25rem 0'
                }}>
                  🔐 Admin Access
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <span style={{ fontWeight: '500' }}>Apartment:</span> 999 (Admin), 1000 (Manager)
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <span style={{ fontWeight: '500' }}>Password:</span> admin123, manager2025
                </p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}