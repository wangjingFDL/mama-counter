import { readFileSync } from 'fs'
import { join } from 'path'
import { AnalysisResult } from './adapters/types'

interface Wordlist {
  categories: Record<string, string[]>
  patterns: string[]
}

function loadWordlist(filename: string): Wordlist {
  return JSON.parse(
    readFileSync(join(__dirname, '..', 'wordlist', filename), 'utf8')
  ) as Wordlist
}

export function analyze(text: string): AnalysisResult {
  const zh = loadWordlist('zh.json')
  const en = loadWordlist('en.json')

  const found = new Set<string>()
  let mamaCount = 0
  const lower = text.toLowerCase()

  for (const wordlist of [zh, en]) {
    for (const [category, words] of Object.entries(wordlist.categories)) {
      for (const word of words) {
        const key = word.toLowerCase()
        if (lower.includes(key) && !found.has(key)) {
          found.add(key)
          if (category === 'mama') mamaCount++
        }
      }
    }

    for (const pattern of wordlist.patterns) {
      const re = new RegExp(pattern, 'gi')
      const matches = text.match(re) ?? []
      for (const m of matches) {
        const key = m.toLowerCase()
        if (!found.has(key)) found.add(key)
      }
    }
  }

  return {
    total: found.size,
    mamaCount,
    curses: [...found]
  }
}
