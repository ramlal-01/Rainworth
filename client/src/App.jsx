import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import RainwaterDashboard from './pages/RainwaterDashboard';
import  Form from './pages/Form';
import MapPage from './pages/MapPage';

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<RainwaterDashboard/>} />
        <Route path="/dashboard/:projectId" element={<RainwaterDashboard/>} />
        <Route path="/form" element={<Form/>} />
        <Route path="/map" element={<MapPage />} />
    </Routes>
  )
}

export default App