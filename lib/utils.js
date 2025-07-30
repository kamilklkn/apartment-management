// lib/utils.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount)
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

export const parseExcelDate = (dateStr) => {
  if (typeof dateStr === 'string' && dateStr.includes('-')) {
    const [datePart, timePart] = dateStr.split('-')
    const [day, month, year] = datePart.split('/')
    return new Date(`${year}-${month}-${day}T${timePart}`)
  }
  return new Date(dateStr)
}

export const extractUserFromDescription = (description) => {
  if (!description || typeof description !== 'string') return null

  const parts = description.split('*')
  if (parts.length < 2) return null

  const fullName = parts[0].trim()
  const [firstName, ...lastNameParts] = fullName.split(' ')
  const lastName = lastNameParts.join(' ')

  let apartmentNumber = null
  const descriptionLower = description.toLowerCase()
  
  const daireMatch = descriptionLower.match(/daire\s*:?\s*(\d+)/)
  if (daireMatch) {
    apartmentNumber = parseInt(daireMatch[1])
  }

  return {
    firstName,
    lastName,
    fullName,
    apartmentNumber,
    originalDescription: description
  }
}