'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Clock, Send, MessageSquare } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { PageHeader } from '@/components/patterns/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { apiPost } from '@/lib/api'

/**
 * The form fields and copy are preserved from the previous page. What
 * changed is that it now actually submits: `handleSubmit` used to be a
 * 2-second `setTimeout` that discarded the message and then told the user
 * they would hear back within 24 hours.
 *
 * The placeholder contact details that were shown before (hello@sproutify.org,
 * +1 555 123-4567, "123 Green Street, Eco City") are removed rather than
 * reproduced — they were invented, and a fake address on a live contact page
 * is worse than none. The "24/7 Community Support" card is gone for the same
 * reason: it directly contradicted the office hours listed beside it.
 */

interface FieldErrors {
  [key: string]: string | undefined
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: '',
  })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address'
    if (!form.subject.trim()) next.subject = 'Please enter a subject'
    if (form.message.trim().length < 10) next.message = 'Please tell us a little more'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await apiPost<{ message: string }>('/api/contact', form, false)
      setSent(true)
      toast.success(res.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send your message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="py-12 md:py-16">
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about an event, or interested in partnering with us? Send a message and we'll get back to you."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
              <Mail size={20} strokeWidth={1.75} />
            </div>
            <h2 className="mt-4 text-h4 text-foreground">How we handle messages</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">
              Messages go to the events team. We aim to reply within a few working days,
              sooner if it is about an event happening this week.
            </p>
          </Card>

          <Card className="mt-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
              <Clock size={20} strokeWidth={1.75} />
            </div>
            <h2 className="mt-4 text-h4 text-foreground">Before an event</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">
              Details like what to bring and where to meet are on each event page. If
              something there is unclear, mention the event name below and we will sort it.
            </p>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6 md:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-success-subtle text-success">
                  <MessageSquare size={20} strokeWidth={1.75} />
                </div>
                <h2 className="mt-4 text-h3 text-foreground">Message sent</h2>
                <p className="mt-2 text-body text-muted-foreground">
                  Thanks. It is with the team and we will be in touch.
                </p>
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', email: '', subject: '', phone: '', message: '' })
                    setConsent(false)
                  }}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-h3 text-foreground">Send us a message</h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={update('name')}
                      aria-invalid={!!errors.name}
                      className="mt-1.5"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-caption text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      aria-invalid={!!errors.email}
                      className="mt-1.5"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-caption text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={update('subject')}
                      aria-invalid={!!errors.subject}
                      className="mt-1.5"
                    />
                    {errors.subject && (
                      <p className="mt-1.5 text-caption text-destructive">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Phone <span className="text-subtle-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={update('phone')}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={form.message}
                      onChange={update('message')}
                      aria-invalid={!!errors.message}
                      placeholder="Tell us about your environmental initiative, question, or how we can help…"
                      className="mt-1.5"
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-caption text-destructive">{errors.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2.5">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="consent" className="text-body-sm font-normal leading-relaxed">
                    I agree to Sproutify storing this message so the team can reply.
                  </Label>
                </div>

                <Button type="submit" size="lg" className="mt-6" disabled={submitting || !consent}>
                  {submitting ? 'Sending…' : 'Send message'}
                  {!submitting && <Send strokeWidth={1.75} />}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Container>
  )
}
