#!/usr/bin/env node
import { program } from 'commander'
import { createInterface } from 'readline'
import { analyze } from './analyzer'
import { writeEntry } from './logger'

async function readStdin(): Promise<string> {
  return new Promise(resolve => {
    if (process.stdin.isTTY) return resolve('')
    let data = ''
    const rl = createInterface({ input: process.stdin })
    rl.on('line', line => (data += line + '\n'))
    rl.on('close', () => resolve(data.trim()))
  })
}

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
    } catch { /* raw text, use as-is */ }

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

program.parse()
