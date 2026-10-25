import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Attempt, Exam } from '../types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
export const uid = () => crypto.randomUUID()
export const fmt = (date: string) => new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(date))
export const maxPoints = (exam: Exam) => exam.questions.reduce((sum,q)=>sum+q.points,0)
export const pointsEarned = (attempt: Attempt) => attempt.answers.reduce((sum,a)=>sum+(a.points ?? 0),0)
export const isReviewPending = (exam: Exam, attempt: Attempt) => exam.questions.some(q=>q.type==='short' && attempt.answers.some(a=>a.questionId===q.id && a.value.trim() && a.points===undefined))
export const youtubeId = (input: string) => {
  if (/^[\w-]{11}$/.test(input)) return input
  try { const url = new URL(input); if (url.hostname==='youtu.be') return url.pathname.slice(1).match(/^[\w-]{11}$/)?.[0] ?? null; if (['youtube.com','www.youtube.com','m.youtube.com'].includes(url.hostname)) return (url.searchParams.get('v') ?? url.pathname.split('/').pop() ?? '').match(/^[\w-]{11}$/)?.[0] ?? null } catch { return null }
  return null
}
