import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

// Renders a scannable QR image encoding the check-in link for an event.
// Takes the event's dedicated `qrCode` token (see Event.qrCode in the Prisma
// schema) — not its `id` — so the printed/displayed code can be rotated
// without changing the event's real identifier.
export const generateQRCode = async (qrCode) => {
  const qrData = `${process.env.NEXT_PUBLIC_BASE_URL}/checkin/${qrCode}`
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