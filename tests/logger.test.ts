import { rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const TEST_HOME = join(tmpdir(), 'cursetrack-test-' + Date.now())
process.env.CURSETRACK_HOME = TEST_HOME

import { writeEntry, readEntries, readTodayEntries } from '../src/logger'
import { LogEntry } from '../src/adapters/types'

afterAll(() => {
  rmSync(TEST_HOME, { recursive: true, force: true })
})

describe('logger', () => {
  it('returns empty array when no log file exists', () => {
    const entries = readEntries('2099-01-01')
    expect(entries).toEqual([])
  })

  it('writes and reads back an entry', () => {
    const entry: LogEntry = {
      ts: '2026-04-07T23:00:00Z',
      agent: 'claude-code',
      curses: ['妈的'],
      mamaCount: 1
    }
    writeEntry(entry)
    const today = new Date().toISOString().slice(0, 10)
    const entries = readEntries(today)
    expect(entries).toHaveLength(1)
    expect(entries[0]).toEqual(entry)
  })

  it('appends multiple entries', () => {
    const entry: LogEntry = {
      ts: '2026-04-07T23:01:00Z',
      agent: 'codex',
      curses: ['fuck'],
      mamaCount: 0
    }
    writeEntry(entry)
    const today = new Date().toISOString().slice(0, 10)
    const entries = readEntries(today)
    expect(entries.length).toBeGreaterThanOrEqual(2)
  })

  it('readTodayEntries returns an array', () => {
    const entries = readTodayEntries()
    expect(Array.isArray(entries)).toBe(true)
  })
})
