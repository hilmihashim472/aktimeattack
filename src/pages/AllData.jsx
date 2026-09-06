import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLeaderboard, CATEGORIES, parseTimeToMs } from '../useLeaderboard'
import styles from './AllData.module.css'

function toLocalDateInputValue(isoString) {
  const d = new Date(isoString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toCsvField(value) {
  const str = String(value ?? '')
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function downloadCsv(rows) {
  const headers = ['Category', 'Name', 'Time', 'Phone', 'Registered']
  const lines = [headers.join(',')]

  for (const row of rows) {
    const categoryLabel = CATEGORIES.find((c) => c.id === row.category)?.label ?? row.category
    const registered = row.created_at ? new Date(row.created_at).toLocaleString() : ''
    lines.push(
      [categoryLabel, row.name, row.time, row.phone ?? '', registered].map(toCsvField).join(',')
    )
  }

  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `time-attack-data-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AllData() {
  const { entries, updateEntry, removeEntry, loading } = useLeaderboard()

  const [editingId, setEditingId] = useState(null)
  const [editFields, setEditFields] = useState({ category: '', name: '', time: '', phone: '' })

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [sortMode, setSortMode] = useState('ranking')

  const rows = useMemo(() => {
    const filtered = entries.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      if (dateFilter && toLocalDateInputValue(e.created_at) !== dateFilter) return false
      return true
    })

    return filtered.sort((a, b) => {
      if (sortMode === 'created') {
        return new Date(b.created_at) - new Date(a.created_at)
      }
      return parseTimeToMs(a.time) - parseTimeToMs(b.time)
    })
  }, [entries, categoryFilter, dateFilter, sortMode])

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditFields({
      category: entry.category,
      name: entry.name === '---' ? '' : entry.name,
      time: entry.time === '0:00.000' ? '' : entry.time,
      phone: entry.phone ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit(id) {
    if (!window.confirm('Save changes to this entry?')) return
    updateEntry(id, {
      category: editFields.category,
      name: editFields.name.trim() || '---',
      time: editFields.time.trim() || '0:00.000',
      phone: editFields.phone.trim() || null,
    })
    setEditingId(null)
  }

  function handleDelete(entry) {
    if (!window.confirm(`Delete ${entry.name}'s entry? This cannot be undone.`)) return
    removeEntry(entry.id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/androidkinglogo.png" alt="Android King logo" className={styles.logo} />
        <h1 className={styles.title}>TIME ATTACK</h1>
        <span className={styles.label}>ALL PARTICIPANT DATA</span>
      </div>

      <div className={styles.filterBar}>
        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <input
          type="date"
          className={styles.filterDate}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        {dateFilter && (
          <button type="button" className={styles.clearDateBtn} onClick={() => setDateFilter('')}>
            Clear date
          </button>
        )}

        <select
          className={styles.filterSelect}
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
        >
          <option value="ranking">Sort: Fastest Time</option>
          <option value="created">Sort: Newest First</option>
        </select>

        <button type="button" className={styles.exportBtn} onClick={() => downloadCsv(rows)}>
          ⬇ Export to Excel
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Time</th>
              <th>Phone</th>
              <th>Registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className={styles.empty}>Loading...</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className={styles.empty}>No entries match these filters</td></tr>
            )}
            {rows.map((entry) => {
              const isEditing = editingId === entry.id
              const categoryLabel = CATEGORIES.find((c) => c.id === entry.category)?.label ?? entry.category
              const registered = entry.created_at ? new Date(entry.created_at).toLocaleString() : '—'

              if (isEditing) {
                return (
                  <tr key={entry.id}>
                    <td>
                      <select
                        className={styles.inlineInput}
                        value={editFields.category}
                        onChange={(e) => setEditFields((f) => ({ ...f, category: e.target.value }))}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className={styles.inlineInput}
                        value={editFields.name}
                        onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))}
                        maxLength={30}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.inlineInput}
                        value={editFields.time}
                        onChange={(e) => setEditFields((f) => ({ ...f, time: e.target.value }))}
                        placeholder="e.g. 1:23.456"
                        maxLength={15}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.inlineInput}
                        value={editFields.phone}
                        onChange={(e) => setEditFields((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Phone"
                        maxLength={20}
                      />
                    </td>
                    <td className={styles.mono}>{registered}</td>
                    <td className={styles.actions}>
                      <button type="button" className={styles.smallBtn} onClick={() => saveEdit(entry.id)}>Save</button>
                      <button type="button" className={styles.smallBtnGhost} onClick={cancelEdit}>Cancel</button>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={entry.id}>
                  <td>{categoryLabel}</td>
                  <td className={styles.nameCell}>{entry.name}</td>
                  <td className={styles.mono}>{entry.time}</td>
                  <td className={styles.mono}>{entry.phone || '—'}</td>
                  <td className={styles.mono}>{registered}</td>
                  <td className={styles.actions}>
                    <button type="button" className={styles.smallBtn} onClick={() => startEdit(entry)}>Edit</button>
                    <button type="button" className={styles.smallBtnDanger} onClick={() => handleDelete(entry)}>✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.actionsRow}>
        <Link to="/edit" className={styles.backBtn}>Back to Edit</Link>
        <Link to="/" className={styles.backBtn}>Back to Leaderboard</Link>
      </div>
    </div>
  )
}
