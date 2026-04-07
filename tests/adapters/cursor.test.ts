import { join } from 'path'
import { getCursorPromptsFromDb } from '../../src/adapters/cursor'

const FIXTURE_DB = join(__dirname, '../fixtures/cursor/state.vscdb')

describe('getCursorPromptsFromDb', () => {
  it('returns empty array when db does not exist', () => {
    const result = getCursorPromptsFromDb('/nonexistent/state.vscdb')
    expect(result).toEqual([])
  })

  it('extracts user prompts from chat data', () => {
    const result = getCursorPromptsFromDb(FIXTURE_DB)
    expect(result).toHaveLength(3)
    expect(result).toContain('fix the auth bug')
    expect(result).toContain('操这个验证逻辑是什么垃圾')
    expect(result).toContain('fuck why is this still broken')
  })

  it('excludes AI responses', () => {
    const result = getCursorPromptsFromDb(FIXTURE_DB)
    expect(result).not.toContain('I can help with that')
  })
})
