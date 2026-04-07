import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { join } from 'path'

const dir = join(__dirname, '../tests/fixtures/cursor')
mkdirSync(dir, { recursive: true })

const db = new Database(join(dir, 'state.vscdb'))
db.exec(`CREATE TABLE IF NOT EXISTS ItemTable (key TEXT PRIMARY KEY, value TEXT)`)

const chatData = JSON.stringify({
  tabs: [{
    chatTitle: 'Test session',
    bubbles: [
      { type: 'user', rawText: 'fix the auth bug', text: 'fix the auth bug' },
      { type: 'ai', text: 'I can help with that' },
      { type: 'user', rawText: '操这个验证逻辑是什么垃圾', text: '操这个验证逻辑是什么垃圾' },
      { type: 'user', rawText: 'fuck why is this still broken', text: 'fuck why is this still broken' }
    ]
  }]
})

db.prepare(`INSERT INTO ItemTable VALUES (?, ?)`).run(
  'workbench.panel.aichat.view.aichat.chatdata',
  chatData
)
db.close()
console.log('Fixture created at tests/fixtures/cursor/state.vscdb')
