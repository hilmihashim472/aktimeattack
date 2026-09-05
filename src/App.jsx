import { Routes, Route } from 'react-router-dom'
import Leaderboard from './pages/Leaderboard'
import Edit from './pages/Edit'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Leaderboard />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  )
}
