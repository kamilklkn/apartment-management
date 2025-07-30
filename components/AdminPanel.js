// components/AdminPanel.js
import { useState, useEffect } from 'react'
import { supabaseAdmin } from '../lib/supabase'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('upload')
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [monthlyParams, setMonthlyParams] = useState([])
  const [additionalFees, setAdditionalFees] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)

  // Upload states
  const [selectedFile, setSelectedFile] = useState(null)
  
  // Parameter states
  const [newMonthlyParam, setNewMonthlyParam] = useState({
    fee_month: new Date().getMonth() + 1,
    fee_year: new Date().getFullYear(),
    additional_amount: 0,
    description: ''
  })

  // User management states
  const [selectedUser, setSelectedUser] = useState('')
  const [newAdditionalFee, setNewAdditionalFee] = useState({
    amount: 0,
    description: '',
    fee_month: new Date().getMonth() + 1,
    fee_year: new Date().getFullYear()
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, paymentsRes, paramsRes, feesRes] = await Promise.all([
        supabaseAdmin.from('users').select('*').order('apartment_number'),
        supabaseAdmin.from('payments').select('*, users(name, surname, apartment_number)').order('payment_date', { ascending: false }).limit(50),
        supabaseAdmin.from('monthly_parameters').select('*').order('fee_year', { ascending: false }).order('fee_month', { ascending: false }),
        supabaseAdmin.from('additional_fees').select('*, users(name, surname, apartment_number)').order('created_at', { ascending: false })
      ])

      setUsers(usersRes.data || [])
      setPayments(paymentsRes.data || [])
      setMonthlyParams(paramsRes.data || [])
      setAdditionalFees(feesRes.data || [])
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setLoading(true)
    setUploadStatus(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload-payments', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setUploadStatus(result)
      
      if (result.success) {
        await loadAllData() // Verileri yenile
        setSelectedFile(null)
      }
    } catch (error) {
      setUploadStatus({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const addMonthlyParameter = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabaseAdmin
        .from('monthly_parameters')
        .upsert({
          fee_month: parseInt(newMonthlyParam.fee_month),
          fee_year: parseInt(newMonthlyParam.fee_year),
          additional_amount: parseFloat(newMonthlyParam.additional_amount),
          description: newMonthlyParam.description
        })

      if (error) throw error

      setNewMonthlyParam({
        fee_month: new Date().getMonth() + 1,
        fee_year: new Date().getFullYear(),
        additional_amount: 0,
        description: ''
      })
      
      await loadAllData()
    } catch (error) {
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const addAdditionalFee = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    setLoading(true)

    try {
      const { error } = await supabaseAdmin
        .from('additional_fees')
        .insert({
          user_id: parseInt(selectedUser),
          amount: parseFloat(newAdditionalFee.amount),
          description: newAdditionalFee.description,
          fee_month: parseInt(newAdditionalFee.fee_month),
          fee_year: parseInt(newAdditionalFee.fee_year)
        })

      if (error) throw error

      setSelectedUser('')
      setNewAdditionalFee({
        amount: 0,
        description: '',
        fee_month: new Date().getMonth() + 1,
        fee_year: new Date().getFullYear()
      })
      
      await loadAllData()
    } catch (error) {
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateUserMonthlyFee = async (userId, newFee) => {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ monthly_fee: parseFloat(newFee) })
        .eq('id', userId)

      if (error) throw error
      
      await loadAllData()
    } catch (error) {
      alert('Hata: ' + error.message)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'upload', name: 'Excel Yükle' },
              { id: 'users', name: 'Kullanıcı Yönetimi' },
              { id: 'parameters', name: 'Parametreler' },
              { id: 'payments', name: 'Ödeme Listesi' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Excel Dosyası Yükle
              </h3>
              
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Banka Hesap Özeti (Excel Dosyası)
                  </label>
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!selectedFile || loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Yükleniyor...' : 'Dosyayı Yükle'}
                </button>
              </form>

              {uploadStatus && (
                <div className={`mt-4 p-4 rounded-md ${
                  uploadStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <h4 className="font-medium">
                    {uploadStatus.success ? 'Başarılı!' : 'Hata!'}
                  </h4>
                  <p className="mt-1">{uploadStatus.message || uploadStatus.error}</p>
                  {uploadStatus.errors && uploadStatus.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Hatalar:</p>
                      <ul className="list-disc list-inside mt-1">
                        {uploadStatus.errors.map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Add Additional Fee */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Kullanıcıya Ek Ücret Ekle
                </h3>
                
                <form onSubmit={addAdditionalFee} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kullanıcı</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seçiniz</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          Daire {user.apartment_number} - {user.name} {user.surname}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAdditionalFee.amount}
                      onChange={(e) => setNewAdditionalFee({...newAdditionalFee, amount: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ay</label>
                    <select
                      value={newAdditionalFee.fee_month}
                      onChange={(e) => setNewAdditionalFee({...newAdditionalFee, fee_month: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {monthNames.map((month, index) => (
                        <option key={index + 1} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yıl</label>
                    <input
                      type="number"
                      value={newAdditionalFee.fee_year}
                      onChange={(e) => setNewAdditionalFee({...newAdditionalFee, fee_year: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </form>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Kullanıcı Listesi
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Daire
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ad Soyad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Aylık Aidat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.apartment_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.name} {user.surname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="number"
                              step="0.01"
                              defaultValue={user.monthly_fee}
                              onBlur={(e) => {
                                if (parseFloat(e.target.value) !== parseFloat(user.monthly_fee)) {
                                  updateUserMonthlyFee(user.id, e.target.value)
                                }
                              }}
                              className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Şifre: apartment123
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <div className="space-y-8">
            {/* Add Monthly Parameter */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Aylık Genel Ek Ücret Ekle
                </h3>
                
                <form onSubmit={addMonthlyParameter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ay</label>
                    <select
                      value={newMonthlyParam.fee_month}
                      onChange={(e) => setNewMonthlyParam({...newMonthlyParam, fee_month: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {monthNames.map((month, index) => (
                        <option key={index + 1} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yıl</label>
                    <input
                      type="number"
                      value={newMonthlyParam.fee_year}
                      onChange={(e) => setNewMonthlyParam({...newMonthlyParam, fee_year: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ek Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMonthlyParam.additional_amount}
                      onChange={(e) => setNewMonthlyParam({...newMonthlyParam, additional_amount: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </form>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                  <textarea
                    value={newMonthlyParam.description}
                    onChange={(e) => setNewMonthlyParam({...newMonthlyParam, description: e.target.value})}
                    rows={2}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bu ek ücretin açıklaması..."
                  />
                </div>
              </div>
            </div>

            {/* Monthly Parameters List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Aylık Parametreler
                </h3>
                
                {monthlyParams.length === 0 ? (
                  <p className="text-gray-500">Henüz aylık parametre eklenmemiş.</p>
                ) : (
                  <div className="space-y-4">
                    {monthlyParams.map((param) => (
                      <div key={param.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {monthNames[param.fee_month - 1]} {param.fee_year}
                            </h4>
                            <p className="text-lg font-semibold text-blue-600">
                              {formatCurrency(param.additional_amount)}
                            </p>
                            {param.description && (
                              <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(param.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Fees List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Kullanıcı Bazında Ek Ücretler
                </h3>
                
                {additionalFees.length === 0 ? (
                  <p className="text-gray-500">Henüz kullanıcı bazında ek ücret eklenmemiş.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Kullanıcı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Dönem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tutar
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Açıklama
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tarih
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {additionalFees.map((fee) => (
                          <tr key={fee.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {fee.users ? (
                                `Daire ${fee.users.apartment_number} - ${fee.users.name} ${fee.users.surname}`
                              ) : (
                                'Bilinmeyen Kullanıcı'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {monthNames[fee.fee_month - 1]} {fee.fee_year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(fee.amount)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              {fee.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(fee.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Son Ödemeler (Son 50 kayıt)
              </h3>
              
              {payments.length === 0 ? (
                <p className="text-gray-500">Henüz ödeme kaydı yok.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Referans
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment, index) => (
                        <tr key={payment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payment.payment_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.users ? (
                              `Daire ${payment.users.apartment_number} - ${payment.users.name} ${payment.users.surname}`
                            ) : (
                              <span className="text-red-500">Eşleşmeyen</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {payment.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {payment.reference_number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}