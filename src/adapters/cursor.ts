import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { homedir, platform } from 'os'
import Database from 'better-sqlite3'
import { AgentAdapter, AgentStats } from './types'
import { analyze } from '../analyzer'

const CHAT_KEY = 'workbench.panel.aichat.view.aichat.chatdata'

function getCursorStoragePath(): string {
  if (platform() === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Cursor', 'User', 'workspaceStorage')
  }
  if (platform() === 'win32') {
    return join(process.env.APPDATA ?? '', 'Cursor', 'User', 'workspaceStorage')
  }
  return join(homedir(), '.config', 'Cursor', 'User', 'workspaceStorage')
}

export function getCursorPromptsFromDb(dbPath: string): string[] {
  if (!existsSync(dbPath)) return []
  try {
    const db = new Database(dbPath, { readonly: true })
    const row = db
      .prepare('SELECT value FROM ItemTable WHERE key = ?')
      .get(CHAT_KEY) as { value: string } | undefined
    db.close()
    if (!row?.value) return []

    const data = JSON.parse(row.value) as {
      tabs?: Array<{
        bubbles?: Array<{ type: string; rawText?: string; text?: string }>
      }>
    }

    const prompts: string[] = []
    for (const tab of data.tabs ?? []) {
      for (const bubble of tab.bubbles ?? []) {
        if (bubble.type === 'user') {
          const text = bubble.rawText ?? bubble.text
          if (text) prompts.push(text)
        }
      }
    }
    return prompts
  } catch {
    return []
  }
}

export const cursorAdapter: AgentAdapter = {
  name: 'Cursor',

  async isAvailable(): Promise<boolean> {
    return existsSync(getCursorStoragePath())
  },

  async getTodayStats(): Promise<AgentStats> {
    const storagePath = getCursorStoragePath()
    if (!existsSync(storagePath)) return { curseCount: 0, mamaCount: 0 }

    let curseCount = 0
    let mamaCount = 0

    for (const ws of readdirSync(storagePath)) {
      const dbPath = join(storagePath, ws, 'state.vscdb')
      for (const prompt of getCursorPromptsFromDb(dbPath)) {
        const result = analyze(prompt)
        curseCount += result.total
        mamaCount += result.mamaCount
      }
    }

    return { curseCount, mamaCount }
  }
}
