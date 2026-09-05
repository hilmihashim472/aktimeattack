import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLeaderboard, CATEGORIES } from '../useLeaderboard'
import styles from './Edit.module.css'

export default function Edit() {
  const { addEntry, updateEntry, removeEntry, getSorted } = useLeaderboard()

  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [phone, setPhone] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editTime, setEditTime] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    addEntry({ category, name, time, phone })
    setName('')
    setTime('')
    setPhone('')
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditName(entry.name)
    setEditTime(entry.time)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit(id) {
    updateEntry(id, { name: editName.trim() || '---', time: editTime.trim() || '0:00.000' })
    setEditingId(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/androidkinglogo.png" alt="Android King logo" className={styles.logo} />
        <h1 className={styles.title}>TIME ATTACK</h1>
        <span className={styles.label}>EDIT LEADERBOARD</span>
      </div>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player name"
          maxLength={30}
        />
        <input
          className={styles.input}
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. 1:23.456"
          maxLength={15}
        />
        <input
          className={styles.input}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          maxLength={20}
        />
        <button type="submit" className={styles.addBtn}>+ Add Entry</button>
      </form>
      <p className={styles.hint}>Any field can be left blank and filled in later — see it, or edit it, on the <Link to="/data" className={styles.hintLink}>All Data</Link> page.</p>

      <div className={styles.categories}>
        {CATEGORIES.map((cat) => {
          const sorted = getSorted(cat.id)
          return (
            <div key={cat.id} className={styles.categoryBlock}>
              <h2 className={styles.categoryTitle}>{cat.label}</h2>
              <div className={styles.entryList}>
                {sorted.length === 0 && <div className={styles.empty}>No entries yet</div>}
                {sorted.map((entry, i) => {
                  const rank = i + 1
                  const isEditing = editingId === entry.id
                  return (
                    <div
                      key={entry.id}
                      className={`${styles.entryRow} ${rank > 10 ? styles.overflowRow : ''}`}
                    >
                      <span className={styles.rank}>{rank}</span>
                      {isEditing ? (
                        <>
                          <input
                            className={styles.inlineInput}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            maxLength={30}
                          />
                          <input
                            className={styles.inlineInput}
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            maxLength={15}
                          />
                          <button type="button" className={styles.smallBtn} onClick={() => saveEdit(entry.id)}>Save</button>
                          <button type="button" className={styles.smallBtnGhost} onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <span className={styles.entryName}>{entry.name}</span>
                          <span className={styles.entryTime}>{entry.time}</span>
                          <button type="button" className={styles.smallBtn} onClick={() => startEdit(entry)}>Edit</button>
                          <button type="button" className={styles.smallBtnDanger} onClick={() => removeEntry(entry.id)}>✕</button>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.actionsRow}>
        <Link to="/data" className={styles.dataBtn}>📋 View All Data</Link>
        <Link to="/" className={styles.backBtn}>Back to Leaderboard</Link>
      </div>
    </div>
  )
}
