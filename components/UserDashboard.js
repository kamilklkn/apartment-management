// components/UserDashboard.js - Modern Dashboard Design
import { useState, useEffect } from 'react'
import { getUserPayments, calculateUserBalance, logoutUser } from '../lib/supabase'

// SVG Icons Components
function NotificationIcon() {
  return (
    <div style={{
      position: 'relative',
      width: '2.5rem',
      height: '2.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
      border: '1px solid #e1e4ea'
    }}>
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path
          d="M10 2a6 6 0 016 6v2.7l1.2 2.4A1 1 0 0116.4 15H3.6a1 1 0 01-.8-1.6L4 11.7V8a6 6 0 016-6zM8.5 17h3a1.5 1.5 0 01-3 0z"
          fill="#525866"
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '6px',
        right: '6px',
        width: '8px',
        height: '8px',
        backgroundColor: '#FB3748',
        borderRadius: '50%',
        border: '2px solid #ffffff'
      }}></div>
    </div>
  )
}

function ArrowDownIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path
        d="M6 7.5l3 3 3-3"
        stroke="#525866"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <circle cx="9" cy="9" r="5" stroke="#99A0AE" strokeWidth="1.5"/>
      <path d="m16 16-3-3" stroke="#99A0AE" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        d="M4 6h12M6 10h8M8 14h4"
        stroke="#525866"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="5" r="1" fill="#525866"/>
      <circle cx="10" cy="10" r="1" fill="#525866"/>
      <circle cx="10" cy="15" r="1" fill="#525866"/>
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        d="M8 6l4 4-4 4"
        stroke="#525866"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Header Component
function DashboardHeader({ user, onLogout }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: '272px',
      right: 0,
      height: '92px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e1e4ea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 10
    }}>
      {/* User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          backgroundColor: '#c0d5ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#335cff'
        }}>
          {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
        </div>
        <div>
          <h1 style={{
            fontSize: '1.125rem',
            fontWeight: '500',
            color: '#0e121b',
            margin: 0,
            fontFamily: "'Inter', sans-serif"
          }}>
            Hoşgeldin, {user?.name} {user?.surname}
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#525866',
            margin: 0,
            fontFamily: "'Inter', sans-serif"
          }}>
            Welcome back to Apartment System 👋🏻
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <NotificationIcon />
        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#335cff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.625rem',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Genel Bakış', icon: '📊' },
    { id: 'payments', label: 'Ödeme Geçmişi', icon: '💳' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
  ]

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '272px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e1e4ea',
      padding: '1rem',
      zIndex: 20
    }}>
      {/* Sidebar Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.625rem',
        padding: '0.75rem',
        border: '1px solid #e1e4ea',
        boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(45deg, #335cff, #3b82f6)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-1a1 1 0 011-1h2a1 1 0 011 1v1m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v12M9 7h6"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#0e121b',
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}>
              Apartment
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#525866',
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}>
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#99a0ae',
          textTransform: 'uppercase',
          letterSpacing: '0.048rem',
          padding: '0.25rem',
          marginBottom: '0.5rem',
          fontFamily: "'Inter', sans-serif"
        }}>
          MAIN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: activeTab === item.id ? '#f5f7fa' : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#525866',
                textAlign: 'left',
                width: '100%',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Stats Cards Component
function StatsCards({ balance }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const stats = [
    {
      title: 'BU YIL ÖDENEN',
      amount: balance?.totalPaid || 0,
      color: '#22c55e',
      bgColor: '#f0fdf4'
    },
    {
      title: 'KALAN BORÇ',
      amount: Math.abs(balance?.balance < 0 ? balance.balance : 0) || 0,
      color: '#ef4444',
      bgColor: '#fef2f2'
    }
  ]

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid #e1e4ea',
            boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)'
          }}
        >
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: '500',
            color: '#99a0ae',
            textTransform: 'uppercase',
            letterSpacing: '0.022rem',
            marginBottom: '0.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            {stat.title}
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#0e121b',
            fontFamily: "'Inter', sans-serif"
          }}>
            {formatCurrency(stat.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}

// Filter Controls Component
function FilterControls() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    }}>
      {/* Switch Toggle */}
      <div style={{
        backgroundColor: '#f5f7fa',
        borderRadius: '0.625rem',
        padding: '0.25rem',
        display: 'flex',
        width: '20rem'
      }}>
        {['All', 'Income', 'Expenses'].map((item, index) => (
          <button
            key={item}
            style={{
              flex: 1,
              padding: '0.25rem 1rem',
              backgroundColor: index === 0 ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: index === 0 ? '#0e121b' : '#99a0ae',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              boxShadow: index === 0 ? '0 6px 10px 0 rgba(14, 18, 27, 0.06), 0 2px 4px 0 rgba(14, 18, 27, 0.03)' : 'none'
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e1e4ea',
          boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          gap: '0.5rem',
          width: '300px'
        }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              color: '#99a0ae',
              fontFamily: "'Inter', sans-serif"
            }}
          />
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e1e4ea',
            borderRadius: '0.25rem',
            padding: '0.125rem 0.375rem',
            fontSize: '0.75rem',
            color: '#99a0ae',
            fontFamily: "'Inter', sans-serif"
          }}>
            ⌘1
          </div>
        </div>

        {/* Filter Button */}
        <button style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e1e4ea',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <FilterIcon />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#525866',
            fontFamily: "'Inter', sans-serif"
          }}>
            Filter
          </span>
        </button>

        {/* Sort Dropdown */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e1e4ea',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <SortIcon />
          <span style={{
            fontSize: '0.875rem',
            color: '#525866',
            fontFamily: "'Inter', sans-serif"
          }}>
            Sort by
          </span>
          <ArrowDownIcon />
        </div>
      </div>
    </div>
  )
}

// Payments Table Component
function PaymentsTable({ payments }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      border: '1px solid #e1e4ea'
    }}>
      {/* Table Header */}
      <div style={{
        backgroundColor: '#f5f7fa',
        display: 'flex',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e1e4ea'
      }}>
        {['Ad Soyad', 'Tutar', 'Aidat', 'Tarih Saat', ''].map((header, index) => (
          <div
            key={header}
            style={{
              flex: index === 0 ? 2 : 1,
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: '400',
              color: '#525866',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {header}
            {header && <SortIcon />}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div>
        {payments.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#99a0ae',
            fontFamily: "'Inter', sans-serif"
          }}>
            Henüz ödeme kaydı bulunmuyor
          </div>
        ) : (
          payments.slice(0, 5).map((payment, index) => (
            <div key={payment.id}>
              <div style={{
                display: 'flex',
                padding: '0.75rem 0',
                alignItems: 'center'
              }}>
                <div style={{
                  flex: 2,
                  padding: '0 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  color: '#0e121b',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Ödeme Alındı
                </div>
                <div style={{
                  flex: 1,
                  padding: '0 0.75rem',
                  fontSize: '0.875rem',
                  color: '#525866',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {formatCurrency(payment.amount)}
                </div>
                <div style={{
                  flex: 1,
                  padding: '0 0.75rem',
                  fontSize: '0.875rem',
                  color: '#525866',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Aidat
                </div>
                <div style={{
                  flex: 1,
                  padding: '0 0.75rem',
                  fontSize: '0.875rem',
                  color: '#525866',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {formatDate(payment.payment_date)}
                </div>
                <div style={{
                  flex: 0,
                  padding: '0 0.75rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.125rem',
                    cursor: 'pointer'
                  }}>
                    <MoreIcon />
                  </button>
                </div>
              </div>
              {index < payments.length - 1 && index < 4 && (
                <div style={{
                  height: '1px',
                  backgroundColor: '#e1e4ea',
                  margin: '0 0.75rem'
                }}></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function UserDashboard({ user }) {
  const [payments, setPayments] = useState([])
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user?.id) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const [paymentsResult, balanceResult] = await Promise.all([
        getUserPayments(user.id),
        calculateUserBalance(user.id)
      ])

      setPayments(paymentsResult.data || [])
      setBalance(balanceResult)
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logoutUser()
    window.location.reload()
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
            Veriler yükleniyor...
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Header */}
      <DashboardHeader user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div style={{
        marginLeft: '272px',
        marginTop: '92px',
        padding: '1rem',
        minHeight: 'calc(100vh - 92px)'
      }}>
        {/* Main Widget Container */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e1e4ea',
          boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
          padding: '1rem',
          minHeight: '765px'
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e1e4ea'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#0e121b',
                  margin: 0,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  All Cards
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#525866',
                  margin: 0,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Monitor and manage transactions across all your cards.
                </p>
              </div>
            </div>
            <button style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e1e4ea',
              borderRadius: '0.625rem',
              boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)',
              padding: '0.625rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#525866',
              fontFamily: "'Inter', sans-serif"
            }}>
              Export As
            </button>
          </div>

          {/* Filter Controls */}
          <FilterControls />

          {/* Stats Cards */}
          <StatsCards balance={balance} />

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#e1e4ea',
            margin: '1.5rem 0'
          }}></div>

          {/* Payments Table */}
          <PaymentsTable payments={payments} />

          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
            padding: '1rem 0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#525866',
              fontFamily: "'Inter', sans-serif"
            }}>
              Page 1 of 1
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#525866',
              fontFamily: "'Inter', sans-serif"
            }}>
              {payments.length} / sayfa
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}