import { Routes, Route } from 'react-router-dom'
import Leaderboard from './pages/Leaderboard'
import Edit from './pages/Edit'
import AllData from './pages/AllData'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Leaderboard />} />
      <Route path="/edit" element={<Edit />} />
      <Route path="/data" element={<AllData />} />
    </Routes>
  )
}
