import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import RainwaterDashboard from './pages/RainwaterDashboard';
import  Form from './pages/Form';
import MapPage from './pages/MapPage';
import TestForm from './pages/TestForm';

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<RainwaterDashboard/>} />
        <Route path="/dashboard/:projectId" element={<RainwaterDashboard/>} />
        <Route path="/form" element={<Form/>} />
        <Route path="/test" element={<TestForm/>} />
        <Route path="/map" element={<MapPage />} />
    </Routes>
  )
}

export default App
