'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ImageOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EVENT_TYPE_LIST } from '@/lib/event-types'
import { apiPost, apiPatch } from '@/lib/api'

/**
 * One form for both create and edit.
 *
 * These were ~300 lines of near-verbatim duplication across
 * app/admin/events/create and app/admin/events/[id]/edit — same fields, same
 * validation, same markup, maintained twice.
 *
 * Two additions beyond the merge:
 *  - a `type` select. The column exists and both the volunteer and admin
 *    views filter and colour by it, but no form has ever written to it.
 *  - a live preview for imageUrl, which was a bare free-text input with no
 *    validation and no indication of whether the URL resolved.
 */

export interface EventFormValues {
  title: string
  description: string
  location: string
  date: string
  startTime: string
  endTime: string
  type: string
  expectedVolunteers: string
  safetyInstructions: string
  isFeatured: boolean
  imageUrl: string
}

export const EMPTY_EVENT: EventFormValues = {
  title: '',
  description: '',
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  type: 'OTHER',
  expectedVolunteers: '',
  safetyInstructions: '',
  isFeatured: false,
  imageUrl: '',
}

type Errors = Partial<Record<keyof EventFormValues, string>>

export function EventForm({
  mode,
  eventId,
  initialValues,
  cancelHref,
}: {
  mode: 'create' | 'edit'
  eventId?: string
  initialValues: EventFormValues
  cancelHref: string
}) {
  const router = useRouter()
  const [values, setValues] = useState<EventFormValues>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [imageBroken, setImageBroken] = useState(false)

  const set = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next: Errors = {}
    if (!values.title.trim()) next.title = 'Event title is required'
    if (!values.description.trim()) next.description = 'Description is required'
    if (!values.location.trim()) next.location = 'Location is required'
    if (!values.date) next.date = 'Date is required'
    if (!values.startTime) next.startTime = 'Start time is required'
    if (!values.endTime) next.endTime = 'End time is required'

    // Only enforced on create — an event being edited may legitimately be in
    // the past (e.g. fixing a typo after the fact).
    if (mode === 'create' && values.date) {
      const selected = new Date(values.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selected < today) next.date = 'Event date cannot be in the past'
    }

    if (values.startTime && values.endTime && values.startTime >= values.endTime) {
      next.endTime = 'End time must be after start time'
    }

    if (
      values.expectedVolunteers &&
      (Number.isNaN(Number(values.expectedVolunteers)) || Number(values.expectedVolunteers) < 1)
    ) {
      next.expectedVolunteers = 'Must be a positive number'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const payload = {
      ...values,
      expectedVolunteers: values.expectedVolunteers ? Number(values.expectedVolunteers) : null,
    }

    try {
      if (mode === 'create') {
        await apiPost('/api/admin/events', payload)
        toast.success('Event created')
        router.push('/admin/events')
      } else {
        await apiPatch(`/api/admin/events/${eventId}`, payload)
        toast.success('Event updated')
        router.push(`/admin/events/${eventId}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save this event')
      setSubmitting(false)
    }
  }

  const fieldError = (key: keyof EventFormValues) =>
    errors[key] ? (
      <p className="mt-1.5 text-caption text-destructive">{errors[key]}</p>
    ) : null

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Marina Beach Cleanup"
              aria-invalid={!!errors.title}
              className="mt-1.5"
            />
            {fieldError('title')}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="type">Category</Label>
              <Select value={values.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger id="type" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPE_LIST.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-caption text-muted-foreground">
                Drives filtering and the artwork shown on event cards.
              </p>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={values.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="e.g. Marina Beach, North Entrance"
                aria-invalid={!!errors.location}
                className="mt-1.5"
              />
              {fieldError('location')}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What volunteers will be doing, and what to expect."
              aria-invalid={!!errors.description}
              className="mt-1.5"
            />
            {fieldError('description')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={values.date}
                onChange={(e) => set('date', e.target.value)}
                aria-invalid={!!errors.date}
                className="mt-1.5"
              />
              {fieldError('date')}
            </div>
            <div>
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                type="time"
                value={values.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                aria-invalid={!!errors.startTime}
                className="mt-1.5"
              />
              {fieldError('startTime')}
            </div>
            <div>
              <Label htmlFor="endTime">End time</Label>
              <Input
                id="endTime"
                type="time"
                value={values.endTime}
                onChange={(e) => set('endTime', e.target.value)}
                aria-invalid={!!errors.endTime}
                className="mt-1.5"
              />
              {fieldError('endTime')}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="expectedVolunteers">Volunteers needed</Label>
              <Input
                id="expectedVolunteers"
                type="number"
                min={1}
                value={values.expectedVolunteers}
                onChange={(e) => set('expectedVolunteers', e.target.value)}
                placeholder="e.g. 50"
                aria-invalid={!!errors.expectedVolunteers}
                className="mt-1.5"
              />
              {fieldError('expectedVolunteers')}
            </div>

            <div>
              <Label htmlFor="imageUrl">
                Image URL <span className="text-subtle-foreground">(optional)</span>
              </Label>
              <Input
                id="imageUrl"
                value={values.imageUrl}
                onChange={(e) => {
                  set('imageUrl', e.target.value)
                  setImageBroken(false)
                }}
                placeholder="https://…"
                className="mt-1.5"
              />
              <p className="mt-1.5 text-caption text-muted-foreground">
                Leave blank to use the category artwork.
              </p>
            </div>
          </div>

          {values.imageUrl.trim() && (
            <div className="overflow-hidden rounded-md border border-border">
              {imageBroken ? (
                <div className="flex items-center gap-2 bg-surface-sunken p-4 text-body-sm text-muted-foreground">
                  <ImageOff size={16} strokeWidth={1.75} />
                  That URL could not be loaded — the category artwork will be used instead.
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.imageUrl}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                  onError={() => setImageBroken(true)}
                />
              )}
            </div>
          )}

          <div>
            <Label htmlFor="safetyInstructions">
              Safety instructions <span className="text-subtle-foreground">(optional)</span>
            </Label>
            <Textarea
              id="safetyInstructions"
              rows={3}
              value={values.safetyInstructions}
              onChange={(e) => set('safetyInstructions', e.target.value)}
              placeholder="What to wear, what to avoid handling, and anything site-specific."
              className="mt-1.5"
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Checkbox
              id="isFeatured"
              checked={values.isFeatured}
              onCheckedChange={(v) => set('isFeatured', v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="isFeatured" className="font-normal leading-relaxed">
              Feature this event on the homepage
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button asChild variant="secondary" type="button">
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
              ? 'Create event'
              : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
