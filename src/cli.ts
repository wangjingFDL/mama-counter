#!/usr/bin/env node
import { program } from 'commander'
import { createInterface } from 'readline'
import { analyze } from './analyzer'
import { writeEntry, readEntries, readTodayEntries } from './logger'
import { claudeCodeAdapter, injectHook } from './adapters/claude-code'
import { cursorAdapter } from './adapters/cursor'
import { codexAdapter } from './adapters/codex'
import { buildReport } from './reporter'
import { getDiagnosis } from './diagnoses'
import { AgentAdapter, DailyReport } from './adapters/types'

const ADAPTERS: AgentAdapter[] = [claudeCodeAdapter, cursorAdapter, codexAdapter]

async function readStdin(): Promise<string> {
  return new Promise(resolve => {
    if (process.stdin.isTTY) return resolve('')
    let data = ''
    const rl = createInterface({ input: process.stdin })
    rl.on('line', line => (data += line + '\n'))
    rl.on('close', () => resolve(data.trim()))
  })
}

// Called by Claude Code hook on every prompt
program
  .command('log')
  .description('Analyze a prompt from stdin (called by agent hooks)')
  .option('--agent <agent>', 'agent name', 'unknown')
  .action(async (opts: { agent: string }) => {
    const raw = await readStdin()
    if (!raw) return
    let prompt = raw
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      prompt = (parsed.prompt ?? parsed.text ?? raw) as string
    } catch { /* raw text */ }
    const result = analyze(prompt)
    if (result.total > 0) {
      writeEntry({
        ts: new Date().toISOString(),
        agent: opts.agent,
        curses: result.curses,
        mamaCount: result.mamaCount
      })
    }
  })

// Configure Claude Code hook; Cursor and Codex need no setup
program
  .command('setup')
  .description('Configure agent integrations')
  .action(() => {
    injectHook()
    console.log('✓ Claude Code: hook injected into ~/.claude/settings.json')
    console.log('')
    console.log('Cursor and Codex are read automatically at report time — no setup needed.')
    console.log('')
    console.log('Run `cursetrack report` at the end of your day 🌙')
  })

// Today's report
program
  .command('report')
  .description("Show today's 骂AI report")
  .option('--week', 'Show 7-day trend')
  .action(async (opts: { week?: boolean }) => {
    if (opts.week) {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(Date.now() - (6 - i) * 86400000)
        return d.toISOString().slice(0, 10)
      })
      const totals = days.map(date => ({
        date,
        count: readEntries(date).reduce((sum, e) => sum + e.curses.length, 0)
      }))
      const max = Math.max(...totals.map(t => t.count), 1)
      console.log('\n  本周骂 AI 趋势\n')
      for (const { date, count } of totals) {
        const filled = Math.round((count / max) * 20)
        const b = '█'.repeat(filled) + '░'.repeat(20 - filled)
        console.log(`  ${date.slice(5)}  ${b}  ${String(count).padStart(3)}`)
      }
      console.log()
      return
    }

    const today = new Date().toISOString().slice(0, 10)
    const byAgent: DailyReport['byAgent'] = {}

    for (const adapter of ADAPTERS) {
      if (await adapter.isAvailable()) {
        byAgent[adapter.name] = await adapter.getTodayStats()
      }
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const yesterdayTotal = readEntries(yesterday)
      .reduce((sum, e) => sum + e.curses.length, 0)

    const report: DailyReport = { date: today, byAgent }
    console.log(buildReport(report, getDiagnosis({ ...report, yesterdayTotal })))
  })

// Historical summary
program
  .command('history')
  .description('Show daily totals for the past 30 days')
  .action(() => {
    console.log('\n  历史记录（近30天）\n')
    let found = false
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      const entries = readEntries(date)
      if (entries.length === 0) continue
      found = true
      const total = entries.reduce((sum, e) => sum + e.curses.length, 0)
      const mama = entries.reduce((sum, e) => sum + e.mamaCount, 0)
      console.log(`  ${date}  骂了 ${total} 次（含妈量 ${mama}）`)
    }
    if (!found) console.log('  暂无记录，先跑 `cursetrack setup` 配置一下')
    console.log()
  })

program.parse()
