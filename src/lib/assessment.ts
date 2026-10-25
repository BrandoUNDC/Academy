import type { Attempt, Exam } from '../types'

export const remainingSeconds = (startedAt: string, minutes: number, now: number) => Math.min(minutes * 60, Math.max(0, Math.ceil((new Date(startedAt).getTime() + minutes * 60_000 - now) / 1000)))

export function gradeAttempt(attempt: Attempt, exam: Exam, online: boolean, submittedAt = new Date().toISOString()): Attempt {
  if (attempt.status !== 'in_progress') return attempt
  const answers = attempt.answers.map(answer => {
    const question = exam.questions.find(q => q.id === answer.questionId)
    return question && question.type !== 'short'
      ? { ...answer, points: answer.value === question.correct ? question.points : 0 }
      : answer
  })
  const pendingReview = exam.questions.some(q => q.type === 'short' && answers.some(a => a.questionId === q.id && a.value.trim()))
  return { ...attempt, answers, submittedAt, status: pendingReview ? 'submitted' : 'graded', sync: online ? 'done' : 'pending' }
}
