export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPrisma } from '@/lib/prisma'

/**
 * Real submission endpoint for the public contact form.
 *
 * Before this, `handleSubmit` on /contact was a 2-second `setTimeout` that
 * threw the message away and then showed the user a success confirmation
 * promising a reply "within 24 hours".
 */

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(120),
  email: z.string().trim().email('Enter a valid email address').max(200),
  subject: z.string().trim().min(1, 'Please enter a subject').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Please tell us a little more').max(5000),
})

/**
 * Per-email throttle. Deliberately a DB query rather than an in-memory
 * counter: Workers isolates are short-lived and per-colo, so in-memory rate
 * limiting is close to useless here.
 */
const THROTTLE_WINDOW_MS = 60 * 1000
const THROTTLE_MAX = 3

export async function POST(request) {
  try {
    const prisma = await getPrisma()
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message || 'Please check the form and try again',
          field: parsed.error.issues[0]?.path?.[0],
        },
        { status: 400 }
      )
    }

    const { name, email, subject, phone, message } = parsed.data

    const recent = await prisma.contactMessage.count({
      where: {
        email,
        createdAt: { gte: new Date(Date.now() - THROTTLE_WINDOW_MS) },
      },
    })

    if (recent >= THROTTLE_MAX) {
      return NextResponse.json(
        { message: "You've sent several messages just now — please give us a moment to reply." },
        { status: 429 }
      )
    }

    await prisma.contactMessage.create({
      data: { name, email, subject, phone: phone || null, message },
    })

    return NextResponse.json(
      { message: "Thanks — your message is with us and we'll be in touch." },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
