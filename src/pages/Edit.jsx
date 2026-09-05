import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLeaderboard } from '../useLeaderboard'
import styles from './Edit.module.css'

const MEDALS = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' }

export default function Edit() {
  const { entries, save } = useLeaderboard()
  const navigate = useNavigate()

  const [fields, setFields] = useState(() =>
    entries.map((e) => ({
      rank: e.rank,
      name: e.name === '---' ? '' : e.name,
      time: e.time === '0:00.000' ? '' : e.time,
    }))
  )
  const [saved, setSaved] = useState(false)

  function handleChange(rank, field, value) {
    setFields((prev) =>
      prev.map((f) => (f.rank === rank ? { ...f, [field]: value } : f))
    )
    setSaved(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const updated = fields.map((f) => ({
      rank: f.rank,
      name: f.name.trim() || '---',
      time: f.time.trim() || '0:00.000',
    }))
    save(updated)
    setSaved(true)
    setTimeout(() => navigate('/'), 800)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/androidkinglogo.png" alt="Android King logo" className={styles.logo} />
        <h1 className={styles.title}>TIME ATTACK</h1>
        <span className={styles.label}>EDIT LEADERBOARD</span>
      </div>

      {saved && <div className={styles.alert}>Saved! Redirecting...</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {fields.map((f) => (
          <div key={f.rank} className={styles.entry}>
            <div className={styles.badge} style={{ color: MEDALS[f.rank] }}>
              {f.rank}
            </div>
            <div className={styles.fields}>
              <div className={styles.group}>
                <label className={styles.fieldLabel}>Name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={f.name}
                  onChange={(e) => handleChange(f.rank, 'name', e.target.value)}
                  placeholder="Player name"
                  maxLength={30}
                />
              </div>
              <div className={styles.group}>
                <label className={styles.fieldLabel}>Time</label>
                <input
                  className={styles.input}
                  type="text"
                  value={f.time}
                  onChange={(e) => handleChange(f.rank, 'time', e.target.value)}
                  placeholder="e.g. 1:23.456"
                  maxLength={15}
                />
              </div>
            </div>
          </div>
        ))}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>Save Changes</button>
          <Link to="/" className={styles.backBtn}>Back</Link>
        </div>
      </form>
    </div>
  )
}
