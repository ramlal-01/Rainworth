import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Form from './pages/Form'

const App = () => {
  return (
      <Routes>
        <Route path="/form" element={<Form />} />
        {/* <Route path="*" element={<Form />} /> */}
      </Routes>
  )
}

export default App