export interface LogEntry {
  ts: string        // ISO 8601 timestamp
  agent: string     // 'claude-code' | 'cursor' | 'codex'
  curses: string[]  // matched words/phrases
  mamaCount: number
}

export interface AnalysisResult {
  total: number
  mamaCount: number
  curses: string[]
}

export interface AgentStats {
  curseCount: number
  mamaCount: number
}

export interface DailyReport {
  date: string                          // YYYY-MM-DD
  byAgent: Record<string, AgentStats>
}

export interface AgentAdapter {
  name: string
  isAvailable(): Promise<boolean>
  getTodayStats(): Promise<AgentStats>
}
