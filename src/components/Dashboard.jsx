import { Users, DollarSign, Briefcase, TrendingUp } from "react-feather"
import "../styles/Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="page-actions">
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">+ Add New Lead</button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Total Leads</h3>
            <p className="stat-card-value">256</p>
            <p className="stat-card-change positive">+12% from last month</p>
          </div>
          <div className="stat-card-icon">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Revenue</h3>
            <p className="stat-card-value">$24,500</p>
            <p className="stat-card-change positive">+8% from last month</p>
          </div>
          <div className="stat-card-icon">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Active Projects</h3>
            <p className="stat-card-value">18</p>
            <p className="stat-card-change negative">-2% from last month</p>
          </div>
          <div className="stat-card-icon">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Conversion Rate</h3>
            <p className="stat-card-value">32%</p>
            <p className="stat-card-change positive">+5% from last month</p>
          </div>
          <div className="stat-card-icon">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="card">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <div className="card-body">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">
                  <Users size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    New lead <strong>John Smith</strong> added
                  </p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon warning">
                  <Briefcase size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    Project <strong>Website Redesign</strong> status updated to <strong>In Progress</strong>
                  </p>
                  <p className="activity-time">5 hours ago</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon info">
                  <DollarSign size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    Invoice <strong>#INV-2023-005</strong> has been paid
                  </p>
                  <p className="activity-time">Yesterday</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon danger">
                  <Users size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    Lead <strong>Sarah Johnson</strong> marked as <strong>Not Interested</strong>
                  </p>
                  <p className="activity-time">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

