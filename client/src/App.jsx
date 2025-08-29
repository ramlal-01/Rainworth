import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import RainwaterDashboard from './pages/RainwaterDashboard';
import  Form from './pages/Form';




const App = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<RainwaterDashboard/>} />
        <Route path="/form" element={<Form/>} />
    </Routes>
  )
}

export default App
