import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import MapPage from './pages/MapPage'
import TempleDetailsPage from './pages/TempleDetailsPage'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/temples/:id" element={<TempleDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      {!isMapPage && <Footer />}
    </>
  )
}

export default App
