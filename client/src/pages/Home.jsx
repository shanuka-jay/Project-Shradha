import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Saddha Temple Map</h1>
        <p>Discover Buddhist temples across the United States</p>
        <Link to="/map" className="btn-primary">Explore the Map</Link>
      </div>
    </div>
  )
}

export default Home
