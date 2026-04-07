import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { AgentAdapter, AgentStats } from './types'
import { readTodayEntries } from '../logger'

const CLAUDE_DIR = join(homedir(), '.claude')
const SETTINGS_PATH = join(CLAUDE_DIR, 'settings.json')
const HOOK_COMMAND = 'cursetrack log --agent claude-code'

export const claudeCodeAdapter: AgentAdapter = {
  name: 'Claude Code',

  async isAvailable(): Promise<boolean> {
    return existsSync(CLAUDE_DIR)
  },

  async getTodayStats(): Promise<AgentStats> {
    const entries = readTodayEntries().filter(e => e.agent === 'claude-code')
    return {
      curseCount: entries.reduce((sum, e) => sum + e.curses.length, 0),
      mamaCount: entries.reduce((sum, e) => sum + e.mamaCount, 0)
    }
  }
}

export function injectHook(): void {
  let settings: Record<string, unknown> = {}
  if (existsSync(SETTINGS_PATH)) {
    settings = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8')) as Record<string, unknown>
  }

  const hooks = (settings.hooks ?? {}) as Record<string, unknown>
  const existing = (hooks.UserPromptSubmit ?? []) as Array<{
    matcher: string
    hooks: Array<{ type: string; command: string }>
  }>

  const alreadyAdded = existing.some(
    h => h.hooks?.some(c => c.command === HOOK_COMMAND)
  )

  if (!alreadyAdded) {
    existing.push({
      matcher: '',
      hooks: [{ type: 'command', command: HOOK_COMMAND }]
    })
  }

  settings.hooks = { ...hooks, UserPromptSubmit: existing }
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8')
}
