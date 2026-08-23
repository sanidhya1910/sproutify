'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Search, Users, UsersRound } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatCard } from '@/components/patterns/StatCard'
import { StatusPill } from '@/components/patterns/StatusPill'
import { ProgressMeter } from '@/components/patterns/ProgressMeter'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { apiGet } from '@/lib/api'
import { formatRelative, formatNumber } from '@/lib/format'

interface Volunteer {
  id: string
  name: string
  email: string
  createdAt: string
  ecoTokens?: number
  stats: { registeredEvents: number; attendedEvents: number }
}

/**
 * Volunteer tiers were previously duplicated across this page and the detail
 * page, in five unrelated colours (blue/green/purple/yellow/grey). Defined
 * once here, with semantic tones.
 */
function tier(v: Volunteer) {
  const attended = v.stats.attendedEvents
  if (attended >= 10) return { label: 'Champion', tone: 'primary' as const }
  if (attended >= 5) return { label: 'Active', tone: 'success' as const }
  if (v.stats.registeredEvents > 0) return { label: 'Registered', tone: 'info' as const }
  return { label: 'New', tone: 'neutral' as const }
}

function VolunteersBody() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'name' | 'joined' | 'attended'>('attended')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-volunteers'],
    queryFn: () => apiGet<Volunteer[]>('/api/admin/volunteers'),
  })

  const all = data ?? []

  const summary = useMemo(
    () => ({
      total: all.length,
      active: all.filter((v) => v.stats.attendedEvents > 0).length,
      champions: all.filter((v) => v.stats.attendedEvents >= 10).length,
    }),
    [all]
  )

  const volunteers = useMemo(() => {
    let list = [...all]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (v) => v.name?.toLowerCase().includes(q) || v.email?.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'joined') return +new Date(b.createdAt) - +new Date(a.createdAt)
      return b.stats.attendedEvents - a.stats.attendedEvents
    })
    return list
  }, [all, search, sort])

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Volunteers"
        description="Everyone registered on the platform, and how active they are."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total volunteers" value={summary.total} icon={Users} />
        <StatCard label="Have attended" value={summary.active} icon={UsersRound} />
        <StatCard label="Champions (10+)" value={summary.champions} icon={UsersRound} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="pl-9 sm:w-72"
            aria-label="Search volunteers"
          />
        </div>

        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="sm:w-52" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="attended">Most events attended</SelectItem>
            <SelectItem value="joined">Recently joined</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-80 rounded-lg" />
        ) : isError ? (
          <EmptyState
            icon={Users}
            title="Couldn't load volunteers"
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : volunteers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? 'No volunteers match that search' : 'No volunteers yet'}
            description={
              search ? undefined : 'People who register on the site will appear here.'
            }
            action={
              search ? (
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Registered</TableHead>
                    <TableHead className="text-right">Attended</TableHead>
                    <TableHead className="w-40">Turnout</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-px" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((v) => {
                    const t = tier(v)
                    return (
                      <TableRow key={v.id}>
                        <TableCell>
                          <Link
                            href={`/admin/volunteers/${v.id}`}
                            className="block font-medium text-foreground transition-colors hover:text-primary-700"
                          >
                            {v.name}
                          </Link>
                          <span className="block truncate text-caption text-muted-foreground">
                            {v.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusPill tone={t.tone}>{t.label}</StatusPill>
                        </TableCell>
                        <TableCell className="tnum text-right">
                          {v.stats.registeredEvents}
                        </TableCell>
                        <TableCell className="tnum text-right">
                          {v.stats.attendedEvents}
                        </TableCell>
                        <TableCell>
                          <ProgressMeter
                            value={v.stats.attendedEvents}
                            max={v.stats.registeredEvents}
                            emptyLabel="—"
                          />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatRelative(v.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/volunteers/${v.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </>
  )
}

export default function AdminVolunteersPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <VolunteersBody />
    </AuthGuard>
  )
}
