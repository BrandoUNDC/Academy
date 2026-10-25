import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { get, set } from 'idb-keyval'
import { seed } from './seed'
import type { Db, Role, User } from './types'
import { uid } from './lib/utils'

type Store = {
  db: Db; ready: boolean; user: User | null; offline: boolean; online: boolean
  login: (user: User) => void; logout: () => void; update: (fn: (db: Db) => Db, action?: string, entity?: string, entityId?: string) => void
  reset: () => void; setOffline: (value: boolean) => void
}
const Context = createContext<Store | null>(null)
const cloneSeed = () => structuredClone(seed)

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Db>(cloneSeed)
  const dbRef = useRef(db)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(() => localStorage.getItem('academy-user'))
  const [offline, setOfflineState] = useState(() => localStorage.getItem('academy-offline') === 'true')
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine)
  useEffect(() => {
    let alive = true
    get<Db>('academy-db-v1').then(saved => { if (alive && saved) { dbRef.current = saved; setDb(saved) } }).catch(() => {}).finally(() => { if (alive) setReady(true) })
    const change = () => setBrowserOnline(navigator.onLine)
    window.addEventListener('online', change); window.addEventListener('offline', change)
    return () => { alive = false; window.removeEventListener('online', change); window.removeEventListener('offline', change) }
  }, [])
  const user = useMemo(() => db.users.find(x => x.id === userId && x.active) ?? null, [db.users, userId])
  const online = browserOnline && !offline
  const update: Store['update'] = (fn, action, entity, entityId) => {
    let next = fn(dbRef.current)
    if (next === dbRef.current) return
    if (action && userId) next = { ...next, audit: [{ id: uid(), actorId: userId, action, entity: entity ?? '', entityId: entityId ?? '', at: new Date().toISOString() }, ...next.audit] }
    dbRef.current = next
    setDb(next)
    void set('academy-db-v1', next).catch(() => alert('No se pudo guardar en este dispositivo. Comprueba el espacio disponible.'))
  }
  const login = (account: User) => { localStorage.setItem('academy-user', account.id); setUserId(account.id) }
  const logout = () => { localStorage.removeItem('academy-user'); setUserId(null) }
  const reset = () => { const next = cloneSeed(); dbRef.current = next; setDb(next); void set('academy-db-v1', next) }
  const setOffline = (value: boolean) => { setOfflineState(value); localStorage.setItem('academy-offline', String(value)) }
  return <Context.Provider value={{ db, ready, user, offline, online, login, logout, update, reset, setOffline }}>{children}</Context.Provider>
}
export function useAcademy() { const value = useContext(Context); if (!value) throw new Error('AcademyProvider missing'); return value }
export const roleHome = (role: Role) => role === 'student' ? '/alumno/inicio' : role === 'teacher' ? '/docente/inicio' : '/admin/inicio'
