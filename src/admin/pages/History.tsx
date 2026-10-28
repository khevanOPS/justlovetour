import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api, errorText, formatWhen } from '../api'

interface Entry {
  id: number
  action: string
  summary: string
  created_at: number
}

export default function History() {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [next, setNext] = useState<number | null>(null)

  const load = (before?: number) =>
    api<{ entries: Entry[]; next: number | null }>(`/api/admin/history${before ? `?before=${before}` : ''}`)
      .then((page) => {
        setEntries((current) => [...(before ? current ?? [] : []), ...page.entries])
        setNext(page.next)
      })
      .catch((error) => toast.error(errorText(error)))

  useEffect(() => {
    api<{ entries: Entry[]; next: number | null }>('/api/admin/history')
      .then((page) => {
        setEntries(page.entries)
        setNext(page.next)
      })
      .catch((error) => toast.error(errorText(error)))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="mt-1 text-gray-600">Every change made in this dashboard, newest first.</p>
      </div>
      {!entries ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <ol className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm">
          {entries.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className={entry.action === 'auth.failed' ? 'text-amber-800' : ''}>{entry.summary}</span>
              <time className="shrink-0 text-sm text-gray-500" dateTime={new Date(entry.created_at).toISOString()}>{formatWhen(entry.created_at)}</time>
            </li>
          ))}
        </ol>
      )}
      {next && <Button variant="outline" className="h-11" onClick={() => load(next)}>Show older changes</Button>}
    </div>
  )
}
