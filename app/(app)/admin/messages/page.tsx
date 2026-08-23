'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Mail, MailOpen, Archive, Inbox } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiGet, apiPatch } from '@/lib/api'
import { formatRelative } from '@/lib/format'

/**
 * Closes the loop on the public contact form. Before Phase 2 that form threw
 * messages away entirely, so there was nothing to read; now they land in
 * ContactMessage and this is where they surface.
 */

type Status = 'NEW' | 'READ' | 'ARCHIVED'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  phone: string | null
  message: string
  status: Status
  createdAt: string
}

const TONE: Record<Status, 'info' | 'neutral' | 'primary'> = {
  NEW: 'info',
  READ: 'primary',
  ARCHIVED: 'neutral',
}

function MessagesBody() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'inbox' | 'archived'>('inbox')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => apiGet<Message[]>('/api/admin/messages'),
  })

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      apiPatch('/api/admin/messages', { id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
    onError: (e: Error) => toast.error(e.message || 'Could not update this message'),
  })

  const all = data ?? []
  const messages = useMemo(
    () =>
      tab === 'inbox'
        ? all.filter((m) => m.status !== 'ARCHIVED')
        : all.filter((m) => m.status === 'ARCHIVED'),
    [all, tab]
  )
  const newCount = all.filter((m) => m.status === 'NEW').length

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Messages"
        description="Enquiries submitted through the public contact form."
      />

      <div className="mt-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="inbox">
              Inbox{newCount > 0 ? ` (${newCount} new)` : ''}
            </TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ) : isError ? (
          <EmptyState
            icon={Inbox}
            title="Couldn't load messages"
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : messages.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={tab === 'inbox' ? 'Nothing in the inbox' : 'Nothing archived'}
            description={
              tab === 'inbox'
                ? 'Messages sent through the contact form will appear here.'
                : undefined
            }
          />
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <li key={m.id}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-h4 text-foreground">{m.subject}</h2>
                          <StatusPill tone={TONE[m.status]}>{m.status.toLowerCase()}</StatusPill>
                        </div>
                        <p className="mt-1 text-body-sm text-muted-foreground">
                          {m.name} ·{' '}
                          <a
                            href={`mailto:${m.email}`}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            {m.email}
                          </a>
                          {m.phone && ` · ${m.phone}`}
                        </p>
                        <p className="mt-3 whitespace-pre-line text-body text-foreground">
                          {m.message}
                        </p>
                        <p className="mt-3 text-caption text-subtle-foreground">
                          Received {formatRelative(m.createdAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        {m.status === 'NEW' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setStatus.mutate({ id: m.id, status: 'READ' })}
                          >
                            <MailOpen strokeWidth={1.75} />
                            Mark read
                          </Button>
                        )}
                        {m.status !== 'ARCHIVED' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStatus.mutate({ id: m.id, status: 'ARCHIVED' })}
                          >
                            <Archive strokeWidth={1.75} />
                            Archive
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStatus.mutate({ id: m.id, status: 'READ' })}
                          >
                            <Mail strokeWidth={1.75} />
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default function AdminMessagesPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <MessagesBody />
    </AuthGuard>
  )
}
