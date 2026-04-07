import { buildReport } from '../src/reporter'
import { DailyReport } from '../src/adapters/types'

function strip(str: string): string {
  return str.replace(/\x1B\[[0-9;]*m/g, '')
}

describe('buildReport', () => {
  it('contains the date', () => {
    const report: DailyReport = {
      date: '2026-04-07',
      byAgent: { 'Claude Code': { curseCount: 8, mamaCount: 2 } }
    }
    expect(strip(buildReport(report, '今天修身养性'))).toContain('2026-04-07')
  })

  it('contains agent name and count', () => {
    const report: DailyReport = {
      date: '2026-04-07',
      byAgent: { 'Codex': { curseCount: 23, mamaCount: 5 } }
    }
    const out = strip(buildReport(report, '正常'))
    expect(out).toContain('Codex')
    expect(out).toContain('23')
  })

  it('shows 含妈量 row when mamaCount > 0', () => {
    const report: DailyReport = {
      date: '2026-04-07',
      byAgent: { 'Claude Code': { curseCount: 10, mamaCount: 6 } }
    }
    const out = strip(buildReport(report, '含妈量爆表'))
    expect(out).toContain('含妈量')
    expect(out).toContain('6')
  })

  it('omits 含妈量 row when mamaCount is 0', () => {
    const report: DailyReport = {
      date: '2026-04-07',
      byAgent: { 'Cursor': { curseCount: 5, mamaCount: 0 } }
    }
    expect(strip(buildReport(report, '正常'))).not.toContain('含妈量')
  })

  it('includes the diagnosis line', () => {
    const report: DailyReport = {
      date: '2026-04-07',
      byAgent: { 'Cursor': { curseCount: 5, mamaCount: 0 } }
    }
    expect(strip(buildReport(report, '正常范围，程序员都懂'))).toContain('正常范围，程序员都懂')
  })
})
