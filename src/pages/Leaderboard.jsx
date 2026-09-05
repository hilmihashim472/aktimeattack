import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLeaderboard } from '../useLeaderboard'
import styles from './Leaderboard.module.css'

// Podium order: 2nd left, 1st centre, 3rd right
const PODIUM_ORDER = [2, 1, 3]

const RANK_CONFIG = {
  1: { color: '#ffd700', bg: 'linear-gradient(180deg, #b8860b 0%, #8B6914 100%)', height: 200, crown: '👑', label: '1ST' },
  2: { color: '#c0c0c0', bg: 'linear-gradient(180deg, #6e6e6e 0%, #4a4a4a 100%)', height: 148, crown: '🥈', label: '2ND' },
  3: { color: '#cd7f32', bg: 'linear-gradient(180deg, #7a4a1e 0%, #5a3515 100%)', height: 112, crown: '🥉', label: '3RD' },
}

export default function Leaderboard() {
  const { entries } = useLeaderboard()
  const byRank = Object.fromEntries(entries.map((e) => [e.rank, e]))

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/androidkinglogo.png" alt="Android King logo" className={styles.logo} />
        <h1 className={styles.title}>TIME ATTACK</h1>
        <span className={styles.subtitle}>TOP 3 LEADERBOARD</span>
      </div>

      <div className={styles.podiumArea}>
        {PODIUM_ORDER.map((rank) => {
          const entry = byRank[rank]
          const cfg = RANK_CONFIG[rank]
          return (
            <div key={rank} className={`${styles.podiumCol} ${styles[`col${rank}`]}`}>
              <div className={styles.playerCard}>
                <div className={styles.crown}>{cfg.crown}</div>
                <div className={styles.playerName}>{entry?.name ?? '---'}</div>
                <div className={styles.playerTime} style={{ color: cfg.color }}>
                  {entry?.time ?? '0:00.000'}
                </div>
              </div>
              <div
                className={styles.podiumBlock}
                style={{ height: cfg.height, background: cfg.bg, borderTop: `4px solid ${cfg.color}` }}
              >
                <span className={styles.podiumLabel} style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <Link to="/edit" className={styles.editBtn}>✏ Edit Leaderboard</Link>

      <button
        className={styles.fullscreenBtn}
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
            <path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V3h4"/><path d="M17 3h4v4"/>
            <path d="M21 17v4h-4"/><path d="M7 21H3v-4"/>
          </svg>
        )}
      </button>
    </div>
  )
}
