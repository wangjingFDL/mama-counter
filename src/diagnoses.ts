import { DailyReport } from './adapters/types'

interface ReportWithHistory extends DailyReport {
  yesterdayTotal: number
}

export function getDiagnosis(report: ReportWithHistory): string {
  const agents = Object.entries(report.byAgent)
  const total = agents.reduce((sum, [, s]) => sum + s.curseCount, 0)
  const mamaCount = agents.reduce((sum, [, s]) => sum + s.mamaCount, 0)

  if (total === 0) return '今天修身养性，AI 表示感谢 🙏'

  if (total > 0 && mamaCount / total > 0.5) {
    return '含妈量爆表，妈妈听到会哭的'
  }

  if (total > 60) {
    return '今天的 bug 一定不是你的问题，建议先吃片降压药'
  }

  if (report.yesterdayTotal > 0 && total > report.yesterdayTotal * 1.5) {
    return '今天状态不对，明天再战'
  }

  if (agents.length > 1) {
    const sorted = [...agents].sort((a, b) => b[1].curseCount - a[1].curseCount)
    const [[worstName, worstStats], [, secondStats]] = sorted
    if (worstStats.curseCount > secondStats.curseCount * 2) {
      return `${worstName} 让你骂得最狠，建议换个工具冷静一下`
    }
  }

  const active = agents.filter(([, s]) => s.curseCount > 0)
  if (active.length === 1) {
    return `今天专情，骂了 ${active[0][0]} 整整一天`
  }

  if (total < 10) return '正常范围，程序员都懂'
  if (total < 30) return '正常水平，每个程序员都这样'
  return '建议在键盘旁边放杯茶'
}
