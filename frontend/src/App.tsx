import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CreateWorkFlow from './components/CreateWorkFlow.tsx'

import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateWorkFlow />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App