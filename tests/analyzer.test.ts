import { analyze } from '../src/analyzer'

describe('analyze', () => {
  it('returns zeros for clean text', () => {
    const result = analyze('please fix the bug in login.ts')
    expect(result.total).toBe(0)
    expect(result.mamaCount).toBe(0)
    expect(result.curses).toHaveLength(0)
  })

  it('detects a Chinese general swear word', () => {
    const result = analyze('这段代码真的是垃圾')
    expect(result.total).toBeGreaterThan(0)
    expect(result.curses).toContain('垃圾')
  })

  it('detects a mama-category word and increments mamaCount', () => {
    const result = analyze('妈的这个bug怎么一直出现')
    expect(result.mamaCount).toBeGreaterThan(0)
    expect(result.total).toBeGreaterThan(0)
  })

  it('detects English swear word', () => {
    const result = analyze('what the fuck is wrong with this type error')
    expect(result.total).toBeGreaterThan(0)
    expect(result.curses.some(c => c.toLowerCase().includes('fuck'))).toBe(true)
  })

  it('matches regex pattern for censored variant f**k', () => {
    const result = analyze('f**k this error will not go away')
    expect(result.total).toBeGreaterThan(0)
  })

  it('does not duplicate the same match in curses array', () => {
    const result = analyze('操你妈')
    const duplicates = result.curses.filter(
      (c, i, arr) => arr.indexOf(c) !== i
    )
    expect(duplicates).toHaveLength(0)
  })

  it('counts mamaCount separately from total', () => {
    const result = analyze('妈的这垃圾代码')
    expect(result.mamaCount).toBeGreaterThanOrEqual(1)
    expect(result.total).toBeGreaterThanOrEqual(2)
  })
})
