import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateWorkFlow from './components/CreateWorkFlow.tsx'

import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<CreateWorkFlow />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App