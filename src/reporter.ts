import chalk from 'chalk'
import { DailyReport } from './adapters/types'

const WIDTH = 56

// CJK characters and emoji occupy 2 columns in monospace terminals
function displayWidth(str: string): number {
  let w = 0
  for (const ch of str) {
    w += /[\u1100-\u115f\u2e80-\u303f\u3040-\u33ff\u3400-\u4dbf\u4e00-\ua4ff\ua960-\ua97f\uac00-\ud7ff\uf900-\ufaff\ufe10-\ufe1f\ufe30-\ufe6f\uff00-\uffef]/.test(ch) || ch.codePointAt(0)! > 0xffff ? 2 : 1
  }
  return w
}

function pad(str: string, width: number): string {
  return str + ' '.repeat(Math.max(0, width - displayWidth(str)))
}

function bar(count: number, max: number, barWidth = 10): string {
  const filled = max > 0 ? Math.round((count / max) * barWidth) : 0
  return '█'.repeat(filled) + '░'.repeat(barWidth - filled)
}

function row(label: string, count: number, max: number, suffix = ''): string {
  const content = `  ${pad(label, 14)} ${bar(count, max)} ${String(count).padStart(4)} 句${suffix}`
  return `║${pad(content, WIDTH - 1)}║`
}

function border(type: '╔' | '╠' | '╚'): string {
  const [l, r] = type === '╔' ? ['╔', '╗'] : type === '╚' ? ['╚', '╝'] : ['╠', '╣']
  return `${l}${'═'.repeat(WIDTH - 1)}${r}`
}

export function buildReport(report: DailyReport, diagnosis: string): string {
  const agents = Object.entries(report.byAgent)
  const totalMama = agents.reduce((sum, [, s]) => sum + s.mamaCount, 0)
  const maxCount = Math.max(...agents.map(([, s]) => s.curseCount), totalMama, 1)

  const titleContent = `  今日骂 AI 报告  ${report.date}`
  const titleRow = `║${pad(titleContent, WIDTH - 1)}║`
  const diagContent = `  今日诊断：${diagnosis}`
  const diagRow = `║${pad(diagContent, WIDTH - 1)}║`

  const lines = [
    border('╔'),
    titleRow,
    border('╠'),
    ...agents.map(([name, stats]) => row(name, stats.curseCount, maxCount)),
    ...(totalMama > 0 ? [border('╠'), row('今日含妈量', totalMama, maxCount, '  🏆')] : []),
    border('╠'),
    diagRow,
    border('╚'),
  ]

  return chalk.cyan(lines.join('\n'))
}
