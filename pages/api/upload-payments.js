// pages/api/upload-payments.js
import { supabaseAdmin } from '../../lib/supabase'
import * as XLSX from 'xlsx'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const parseDate = (dateStr) => {
  // "05/05/2025-19:11:52" formatını parse et
  if (typeof dateStr === 'string' && dateStr.includes('-')) {
    const [datePart, timePart] = dateStr.split('-')
    const [day, month, year] = datePart.split('/')
    return new Date(`${year}-${month}-${day}T${timePart}`)
  }
  return new Date(dateStr)
}

const extractUserInfoFromDescription = (description) => {
  if (!description || typeof description !== 'string') return null

  // "Resul Elçi*0209*daire 1 mayis ayın aydati*10034493*FAST" formatından bilgi çıkar
  const parts = description.split('*')
  if (parts.length < 2) return null

  const fullName = parts[0].trim()
  const [firstName, ...lastNameParts] = fullName.split(' ')
  const lastName = lastNameParts.join(' ')

  // Açıklamadan daire numarasını çıkarmaya çalış
  let apartmentNumber = null
  const descriptionLower = description.toLowerCase()
  
  // "daire X" veya "daire:X" formatını ara
  const daireMatch = descriptionLower.match(/daire\s*:?\s*(\d+)/);
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'Dosya bulunamadı' })
    }

    // Excel dosyasını oku
    const fileBuffer = fs.readFileSync(file.filepath)
    const workbook = XLSX.read(fileBuffer, {
      cellStyles: true,
      cellFormulas: true,
      cellDates: true,
    })

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

    let processedPayments = 0
    let skippedPayments = 0
    const errors = []

    // Kullanıcıları önce yükle
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('*')

    const userMap = new Map()
    users?.forEach(user => {
      userMap.set(user.apartment_number, user.id)
      // İsim eşleştirmesi için de map'e ekle
      const fullName = `${user.name} ${user.surname}`.toLowerCase()
      userMap.set(fullName, user.id)
    })

    // İşlem verilerini işle (başlık satırından sonra)
    for (let i = 16; i < jsonData.length; i++) { // 16. satırdan başla (başlık sonrası)
      const row = jsonData[i]
      
      if (!row || row.length < 9) continue

      const [
        dateTimeStr,
        valorDate,
        channel,
        amount,
        balance,
        extraBalance,
        transactionCode,
        transactionType,
        description,
        ...rest
      ] = row

      // Sadece gelen ödemeleri al (pozitif tutarlar ve FAST işlemleri)
      if (!amount || parseFloat(amount) <= 0) continue
      if (!description || typeof description !== 'string') continue
      if (!description.includes('FAST')) continue

      try {
        const paymentDate = parseDate(dateTimeStr)
        const paymentAmount = parseFloat(amount)
        const referenceNumber = rest[rest.length - 1] // Son sütun genelde referans numarası

        if (!referenceNumber) continue

        // Duplikasyon kontrolü
        const { data: existingPayment } = await supabaseAdmin
          .from('payments')
          .select('id')
          .eq('reference_number', referenceNumber)
          .eq('payment_date', paymentDate.toISOString())
          .single()

        if (existingPayment) {
          skippedPayments++
          continue
        }

        // Kullanıcı bilgisini çıkar
        const userInfo = extractUserInfoFromDescription(description)
        let userId = null

        if (userInfo) {
          // Önce daire numarasına göre ara
          if (userInfo.apartmentNumber) {
            userId = userMap.get(userInfo.apartmentNumber)
          }
          
          // Daire numarası yoksa isim eşleştirmesi yap
          if (!userId) {
            const fullNameLower = userInfo.fullName.toLowerCase()
            userId = userMap.get(fullNameLower)
            
            // Tam eşleşme yoksa benzer isim ara
            if (!userId) {
              for (const [name, id] of userMap) {
                if (typeof name === 'string' && 
                    (name.includes(userInfo.firstName.toLowerCase()) || 
                     fullNameLower.includes(name))) {
                  userId = id
                  break
                }
              }
            }
          }
        }

        // Ödemeyi kaydet
        const { error: insertError } = await supabaseAdmin
          .from('payments')
          .insert({
            payment_date: paymentDate.toISOString(),
            amount: paymentAmount,
            description: description,
            reference_number: referenceNumber,
            user_id: userId
          })

        if (insertError) {
          errors.push(`Satır ${i + 1}: ${insertError.message}`)
        } else {
          processedPayments++
        }

      } catch (error) {
        errors.push(`Satır ${i + 1}: ${error.message}`)
      }
    }

    // Geçici dosyayı temizle
    fs.unlinkSync(file.filepath)

    res.status(200).json({
      success: true,
      processedPayments,
      skippedPayments,
      errors,
      message: `${processedPayments} ödeme işlendi, ${skippedPayments} ödeme zaten mevcuttu.`
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Dosya işlenirken hata oluştu: ' + error.message })
  }
}