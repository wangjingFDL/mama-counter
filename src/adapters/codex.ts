import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { AgentAdapter, AgentStats } from './types'
import { analyze } from '../analyzer'

export async function getCodexPromptsForDate(
  codexBase: string,
  date: string
): Promise<string[]> {
  const [year, month, day] = date.split('-')
  const dir = join(codexBase, 'sessions', year, month, day)
  if (!existsSync(dir)) return []

  const files = readdirSync(dir).filter(f => f.endsWith('.jsonl'))
  const prompts: string[] = []

  for (const file of files) {
    const lines = readFileSync(join(dir, file), 'utf8')
      .split('\n')
      .filter(Boolean)

    for (const line of lines) {
      try {
        const entry = JSON.parse(line) as { role?: string; content?: unknown }
        if (entry.role === 'user') {
          const text = typeof entry.content === 'string'
            ? entry.content
            : JSON.stringify(entry.content)
          if (text) prompts.push(text)
        }
      } catch { /* skip malformed lines */ }
    }
  }

  return prompts
}

const CODEX_DIR = join(homedir(), '.codex')

export const codexAdapter: AgentAdapter = {
  name: 'Codex',

  async isAvailable(): Promise<boolean> {
    return existsSync(join(CODEX_DIR, 'sessions'))
  },

  async getTodayStats(): Promise<AgentStats> {
    const today = new Date().toISOString().slice(0, 10)
    const prompts = await getCodexPromptsForDate(CODEX_DIR, today)
    let curseCount = 0
    let mamaCount = 0
    for (const prompt of prompts) {
      const result = analyze(prompt)
      curseCount += result.total
      mamaCount += result.mamaCount
    }
    return { curseCount, mamaCount }
  }
}
