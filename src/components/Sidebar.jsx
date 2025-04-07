import { NavLink } from "react-router-dom"
import { Users, Briefcase, UserPlus, FileText, Activity, Settings, HelpCircle, LogOut } from "react-feather"
import "../styles/Sidebar.css"

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h1 className="logo">ClezidFlow</h1>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-menu">
          <ul>
            <li className="menu-section">
              <span className="menu-section-text">Main</span>
            </li>
            <li className="menu-item">
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                <Users size={18} />
                <span>Leads</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
                <Briefcase size={18} />
                <span>Projects</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/teams" className={({ isActive }) => (isActive ? "active" : "")}>
                <UserPlus size={18} />
                <span>Teams</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/invoices" className={({ isActive }) => (isActive ? "active" : "")}>
                <FileText size={18} />
                <span>Quotations</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/activity" className={({ isActive }) => (isActive ? "active" : "")}>
                <Activity size={18} />
                <span>Activity Log</span>
              </NavLink>
            </li>

            <li className="menu-section">
              <span className="menu-section-text">Settings</span>
            </li>
            <li className="menu-item">
              <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/help" className={({ isActive }) => (isActive ? "active" : "")}>
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

