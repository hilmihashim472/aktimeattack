import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

const TABLE = 'leaderboard'

export const CATEGORIES = [
  { id: 'open', label: 'Open Category' },
  { id: 'ladies-kids', label: 'Ladies & Kids Category' },
]

export function parseTimeToMs(time) {
  if (!time) return Infinity
  const match = String(time).trim().match(/^(?:(\d+):)?(\d{1,2})(?:\.(\d{1,3}))?$/)
  if (!match) return Infinity
  const [, min, sec, ms] = match
  const minutes = min ? parseInt(min, 10) : 0
  const seconds = parseInt(sec, 10)
  const millis = ms ? parseInt(ms.padEnd(3, '0'), 10) : 0
  return (minutes * 60 + seconds) * 1000 + millis
}

export function useLeaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from(TABLE).select('*')
    if (!error) setEntries(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    supabase.from(TABLE).select('*').then(({ data, error }) => {
      if (cancelled) return
      if (!error) setEntries(data)
      setLoading(false)
    })

    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, refresh)
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [refresh])

  async function addEntry({ category, name, time, phone }) {
    await supabase.from(TABLE).insert({
      category,
      name: name?.trim() || '---',
      time: time?.trim() || '0:00.000',
      phone: phone?.trim() || null,
    })
    refresh()
  }

  async function updateEntry(id, changes) {
    await supabase.from(TABLE).update(changes).eq('id', id)
    refresh()
  }

  async function removeEntry(id) {
    await supabase.from(TABLE).delete().eq('id', id)
    refresh()
  }

  function getSorted(category) {
    return entries
      .filter((e) => e.category === category)
      .slice()
      .sort((a, b) => parseTimeToMs(a.time) - parseTimeToMs(b.time))
  }

  function getRanked(category, limit = 10) {
    return getSorted(category).slice(0, limit)
  }

  function getAll() {
    return entries
      .slice()
      .sort((a, b) => parseTimeToMs(a.time) - parseTimeToMs(b.time))
  }

  return { entries, loading, addEntry, updateEntry, removeEntry, getSorted, getRanked, getAll }
}
