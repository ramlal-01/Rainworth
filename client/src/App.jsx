import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'


const App = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
    </Routes>
  )
}

export default App
