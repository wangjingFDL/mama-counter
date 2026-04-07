import { join } from 'path'
import { getCodexPromptsForDate } from '../../src/adapters/codex'

const FIXTURE_BASE = join(__dirname, '../fixtures/codex')

describe('getCodexPromptsForDate', () => {
  it('returns empty array when sessions directory does not exist', async () => {
    const result = await getCodexPromptsForDate('/nonexistent', '2026-04-07')
    expect(result).toEqual([])
  })

  it('extracts user prompts from rollout JSONL files', async () => {
    const result = await getCodexPromptsForDate(FIXTURE_BASE, '2026-04-07')
    expect(result).toHaveLength(3)
    expect(result).toContain('fix the login bug')
    expect(result).toContain('操这个bug一直出现，妈的')
    expect(result).toContain('what the fuck is this error')
  })

  it('excludes assistant messages', async () => {
    const result = await getCodexPromptsForDate(FIXTURE_BASE, '2026-04-07')
    expect(result).not.toContain("I'll help you fix that.")
    expect(result).not.toContain('I see the issue.')
  })
})
