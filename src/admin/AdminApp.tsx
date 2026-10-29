import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Clock, FileText, Heart, Image, LogOut, MapPin, Settings as SettingsIcon, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api, errorText, setSignedOutHandler } from './api'
import History from './pages/History'
import PageTexts from './pages/PageTexts'
import Photos from './pages/Photos'
import Settings from './pages/Settings'
import TourEditor from './pages/TourEditor'
import Tours from './pages/Tours'
import Transfers from './pages/Transfers'

interface Admin {
  id: number
  name: string
  email: string
}

const NAV = [
  { path: 'tours', label: 'Tours', icon: Ticket },
  { path: 'photos', label: 'Photos', icon: Image },
  { path: 'texts', label: 'Page texts', icon: FileText },
  { path: 'transfers', label: 'Transfers', icon: MapPin },
  { path: 'settings', label: 'Settings', icon: SettingsIcon },
  { path: 'history', label: 'History', icon: Clock },
] as const

const readRoute = () => window.location.hash.replace(/^#\/?/, '') || 'tours'

export default function AdminApp() {
  const [admin, setAdmin] = useState<Admin | null | undefined>(undefined)
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const checkSession = useCallback(() => {
    api<{ admin: Admin }>('/api/auth/me')
      .then(({ admin }) => setAdmin(admin))
      .catch(() => setAdmin(null))
  }, [])

  useEffect(() => {
    setSignedOutHandler(() => setAdmin(null))
    checkSession()
  }, [checkSession])

  if (admin === undefined) return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading…</div>
  if (admin === null) return <SignIn onSignedIn={checkSession} />

  const [section, id] = route.split('/')
  const signOut = async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setAdmin(null)
  }

  let page
  if (section === 'tours' && id) page = <TourEditor id={id === 'new' ? null : Number(id)} />
  else if (section === 'photos') page = <Photos />
  else if (section === 'texts') page = <PageTexts />
  else if (section === 'transfers') page = <Transfers />
  else if (section === 'settings') page = <Settings />
  else if (section === 'history') page = <History />
  else page = <Tours />

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-gray-900 md:flex">
      <aside className="sticky top-0 z-20 border-b border-gray-200 bg-[#134e4a] text-white md:h-screen md:w-60 md:shrink-0 md:border-b-0">
        <div className="flex items-center justify-between px-4 py-3 md:block md:px-5 md:py-6">
          <div className="flex items-center gap-2 font-semibold">
            <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
            Just Love Tour
          </div>
          <p className="hidden text-sm text-white/70 md:mt-1 md:block">Signed in as {admin.name}</p>
          <button type="button" onClick={signOut} className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm text-white/85 hover:bg-white/10 md:hidden">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3" aria-label="Admin sections">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = section === path || (!NAV.some((n) => n.path === section) && path === 'tours')
            return (
              <a
                key={path}
                href={`#/${path}`}
                aria-current={active ? 'page' : undefined}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium ${active ? 'bg-white text-[#134e4a]' : 'text-white/85 hover:bg-white/10'}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </a>
            )
          })}
        </nav>
        <div className="hidden px-3 md:absolute md:bottom-4 md:block md:w-60">
          <button type="button" onClick={signOut} className="flex h-11 w-full items-center gap-2 rounded-lg px-3 text-sm text-white/85 hover:bg-white/10">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="mt-1 flex h-11 items-center px-3 text-sm text-white/70 hover:text-white">
            View the website ↗
          </a>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">{page}</main>
    </div>
  )
}

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/api/auth/login', { method: 'POST', json: { email, password } })
      onSignedIn()
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#134e4a] px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl bg-white p-7 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold">Just Love Tour</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to edit the website</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={busy} className="h-12 w-full bg-teal-600 text-base hover:bg-teal-700">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
