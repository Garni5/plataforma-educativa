
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="topbar">
        <span>Plataforma</span>
        <div className="nav">
          <NavLink to="/home" className={({isActive}) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/register" className={({isActive}) => isActive ? 'active' : ''}>
            Registro
          </NavLink>
        </div>
    </nav>
  )
}

export default Navbar