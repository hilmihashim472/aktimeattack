import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLeaderboard, CATEGORIES } from '../useLeaderboard'
import styles from './AllData.module.css'

export default function AllData() {
  const { getAll, updateEntry, removeEntry, loading } = useLeaderboard()

  const [editingId, setEditingId] = useState(null)
  const [editFields, setEditFields] = useState({ category: '', name: '', time: '', phone: '' })

  const all = getAll()

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

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Time</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className={styles.empty}>Loading...</td></tr>
            )}
            {!loading && all.length === 0 && (
              <tr><td colSpan={5} className={styles.empty}>No entries yet</td></tr>
            )}
            {all.map((entry) => {
              const isEditing = editingId === entry.id
              const categoryLabel = CATEGORIES.find((c) => c.id === entry.category)?.label ?? entry.category

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
