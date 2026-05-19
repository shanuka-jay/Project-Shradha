import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import MapPage from './pages/MapPage'
import TempleDetailsPage from './pages/TempleDetailsPage'
import MonkProfile from './pages/MonkProfile'
import './App.css'

function App() {
  const location = useLocation()
  const hideNavbar = location.pathname.startsWith('/monks/') || location.pathname.startsWith('/temples/')

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/map"         element={<MapPage />} />
          <Route path="/temples/:id" element={<TempleDetailsPage />} />
          <Route path="/monks/:id"   element={<MonkProfile />} />
        </Routes>
      </div>
      {<Footer />}
    </>
  )
}

export default App
