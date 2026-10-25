import { describe, expect, it } from 'vitest'
import { gradeAttempt, remainingSeconds } from './assessment'
import { seed } from '../seed'
import type { Attempt } from '../types'

const exam = seed.exams[0]
const base: Attempt = { id: 'local-1', examId: exam.id, studentId: 's1', startedAt: '2026-10-25T10:00:00.000Z', status: 'in_progress', sync: 'pending', answers: [
  { questionId: 'q1', value: '2/4', updatedAt: '2026-10-25T10:01:00.000Z' },
  { questionId: 'q2', value: 'Falso', updatedAt: '2026-10-25T10:02:00.000Z' },
  { questionId: 'q3', value: 'Busco un denominador común.', updatedAt: '2026-10-25T10:03:00.000Z' },
] }

describe('evaluación local', () => {
  it('preserva el tiempo de inicio al recalcular el temporizador', () => {
    expect(remainingSeconds(base.startedAt, 25, Date.parse('2026-10-25T10:10:00.000Z'))).toBe(900)
    expect(remainingSeconds(base.startedAt, 25, Date.parse('2026-10-25T10:30:00.000Z'))).toBe(0)
  })
  it('califica cerradas y deja la respuesta corta para revisión manual', () => {
    const result = gradeAttempt(base, exam, false)
    expect(result.answers.map(a => a.points)).toEqual([4, 0, undefined])
    expect(result.status).toBe('submitted')
    expect(result.sync).toBe('pending')
  })
  it('no altera una entrega ya cerrada', () => {
    const closed = gradeAttempt(base, exam, true)
    expect(gradeAttempt(closed, exam, true)).toBe(closed)
  })
  it('mantiene diez entregas offline independientes al reintentar', () => {
    const attempts = Array.from({ length: 10 }, (_, i) => gradeAttempt({ ...base, id: `local-${i}` }, exam, false))
    expect(new Set(attempts.map(a => a.id)).size).toBe(10)
    expect(attempts.every(a => a.sync === 'pending' && a.answers.length === 3)).toBe(true)
    expect(attempts.map(a => gradeAttempt(a, exam, true))).toEqual(attempts)
  })
})
