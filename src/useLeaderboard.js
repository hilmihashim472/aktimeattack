import { useState } from 'react'

const STORAGE_KEY = 'timeattack_leaderboard'

const DEFAULT = [
  { rank: 1, name: '---', time: '0:00.000' },
  { rank: 2, name: '---', time: '0:00.000' },
  { rank: 3, name: '---', time: '0:00.000' },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState(load)

  function save(updated) {
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { entries, save }
}
