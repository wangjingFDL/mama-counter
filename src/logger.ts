import { existsSync, mkdirSync, appendFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { LogEntry } from './adapters/types'

function getLogDir(): string {
  const base = process.env.CURSETRACK_HOME ?? join(homedir(), '.mama-counter')
  return join(base, 'logs')
}

function getLogPath(date: string): string {
  return join(getLogDir(), `${date}.jsonl`)
}

export function writeEntry(entry: LogEntry): void {
  const dir = getLogDir()
  mkdirSync(dir, { recursive: true })
  appendFileSync(
    getLogPath(new Date().toISOString().slice(0, 10)),
    JSON.stringify(entry) + '\n',
    'utf8'
  )
}

export function readEntries(date: string): LogEntry[] {
  const path = getLogPath(date)
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line) as LogEntry)
}

export function readTodayEntries(): LogEntry[] {
  return readEntries(new Date().toISOString().slice(0, 10))
}
