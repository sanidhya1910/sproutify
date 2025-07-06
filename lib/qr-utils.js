import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

export const generateQRCode = async (eventId) => {
  const qrData = `${process.env.NEXT_PUBLIC_BASE_URL}/checkin/${eventId}`
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0369a1',
        light: '#ffffff'
      }
    })
    return qrCodeUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    return null
  }
}

export const generateEventQRId = () => {
  return uuidv4()
}