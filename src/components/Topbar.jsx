"use client"
import { Menu, Bell, Search, User } from "react-feather"
import "../styles/Topbar.css"

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-button">
          <Bell size={20} />
          <span className="notification-badge">5</span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Harsh</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar

