import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { AgentAdapter, AgentStats } from './types'
import { readTodayEntries } from '../logger'

const CLAUDE_DIR = join(homedir(), '.claude')
const SETTINGS_PATH = join(CLAUDE_DIR, 'settings.json')

function buildHookCommand(): string {
  // If installed globally (npm install -g), argv[1] will be the bin symlink
  // Prefer that; it works even if PATH changes later
  const cliPath = process.argv[1]
  if (cliPath && cliPath.endsWith('cli.js')) {
    return `node ${cliPath} log --agent claude-code`
  }
  return 'mama log --agent claude-code'
}

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

  const hookCommand = buildHookCommand()
  // Remove any stale mama log entries (e.g. old path or plain 'mama' command)
  const filtered = existing.filter(
    h => !h.hooks?.some(c => c.command.includes('log --agent claude-code'))
  )
  filtered.push({
    matcher: '',
    hooks: [{ type: 'command', command: hookCommand }]
  })

  settings.hooks = { ...hooks, UserPromptSubmit: filtered }
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8')
}
