import { getDiagnosis } from '../src/diagnoses'
import { DailyReport } from '../src/adapters/types'

function report(
  byAgent: Record<string, { curseCount: number; mamaCount: number }>,
  yesterdayTotal = 0
): DailyReport & { yesterdayTotal: number } {
  return { date: '2026-04-07', byAgent, yesterdayTotal }
}

describe('getDiagnosis', () => {
  it('returns calm message when total is zero', () => {
    expect(getDiagnosis(report({ 'Claude Code': { curseCount: 0, mamaCount: 0 } })))
      .toContain('修身养性')
  })

  it('returns a string for moderate usage', () => {
    const msg = getDiagnosis(report({ 'Claude Code': { curseCount: 15, mamaCount: 2 } }))
    expect(typeof msg).toBe('string')
    expect(msg.length).toBeGreaterThan(0)
  })

  it('returns high-count message when total exceeds 60', () => {
    const msg = getDiagnosis(report({ 'Claude Code': { curseCount: 65, mamaCount: 5 } }))
    expect(msg).toMatch(/bug|降压药|建议/)
  })

  it('returns high mama message when mamaCount exceeds half of total', () => {
    const msg = getDiagnosis(report({ 'Codex': { curseCount: 10, mamaCount: 8 } }))
    expect(msg).toContain('含妈量')
  })

  it('names the worst agent when one is more than double the others', () => {
    const msg = getDiagnosis(report({
      'Claude Code': { curseCount: 3, mamaCount: 0 },
      'Codex': { curseCount: 20, mamaCount: 2 }
    }))
    expect(msg).toContain('Codex')
  })

  it('mentions agent name when only one agent used', () => {
    const msg = getDiagnosis(report({ 'Cursor': { curseCount: 5, mamaCount: 0 } }))
    expect(msg).toContain('Cursor')
  })
})
