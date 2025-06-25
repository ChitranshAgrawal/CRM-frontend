"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Save } from "react-feather"
import "../styles/Update.css"

export default function UpdateForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [clientData, setClientData] = useState({
    clientName: "",
    companyName: "",
    contactNo: "",
    email: "",
    source: "",
    priority: "",
    status: "",
    assignedTo: "",
    salesRep: "",
    createdBy: "",
    mode: "",
    followUpDate: "",
    notes: "",
    dealSize: "",
    expectedClosureDate: "",
    createdAt: "",
  })

  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${url}/leads/${id}`)
      .then((res) => {
        // Format dates for input fields
        const data = { ...res.data }
        if (data.followUpDate) data.followUpDate = data.followUpDate.slice(0, 10)
        if (data.expectedClosureDate) data.expectedClosureDate = data.expectedClosureDate.slice(0, 10)
        if (data.createdAt) data.createdAt = data.createdAt.slice(0, 10)

        setClientData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setClientData({ ...clientData, [name]: value })
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setSaving(true)

    axios
      .put(`${url}/leads/${id}`, clientData)
      .then(() => {
        setSaving(false)
        if (clientData.status === "Converted") {
          alert("Lead converted! Redirecting to Projects page...")
          navigate("/projects")
        } else {
          alert("Lead updated successfully!")
          navigate("/")
        }
      })
      .catch((err) => {
        console.log(err)
        setSaving(false)
        alert("Failed to update lead. Please try again.")
      })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading lead data...</p>
      </div>
    )
  }

  return (
    <div className="update-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Back to Leads</span>
        </button>
        <h1>Update Lead</h1>
      </div>

      <div className="form-container">
        <div className="form-header">
          <h2>Lead Information</h2>
          <div className="lead-id-display">
            <span>Lead ID:</span>
            <strong>{clientData.leadID}</strong>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="clientName">
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className="form-control"
                value={clientData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="form-control"
                value={clientData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactNo">
                Contact Number *
              </label>
              <input
                type="text"
                id="contactNo"
                name="contactNo"
                className="form-control"
                value={clientData.contactNo}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={clientData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="source">
                Source
              </label>
              <select
                id="source"
                name="source"
                className="form-control"
                value={clientData.source}
                onChange={handleChange}
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={clientData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={clientData.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Converted">Converted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="assignedTo">
                Assigned To
              </label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                className="form-control"
                value={clientData.assignedTo}
                onChange={handleChange}
                placeholder="Enter assignee name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salesRep">
                Sales Representative
              </label>
              <input
                type="text"
                id="salesRep"
                name="salesRep"
                className="form-control"
                value={clientData.salesRep}
                onChange={handleChange}
                placeholder="Enter sales rep name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="createdBy">
                Created By
              </label>
              <input
                type="text"
                id="createdBy"
                name="createdBy"
                className="form-control"
                value={clientData.createdBy}
                onChange={handleChange}
                placeholder="Enter creator name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mode">
                Mode of Contact
              </label>
              <select id="mode" name="mode" className="form-control" value={clientData.mode} onChange={handleChange}>
                <option value="">Select Mode</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
                <option value="Video Call">Video Call</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="followUpDate">
                Follow-up Date
              </label>
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                className="form-control"
                value={clientData.followUpDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dealSize">
                Deal Size ($)
              </label>
              <input
                type="number"
                id="dealSize"
                name="dealSize"
                className="form-control"
                value={clientData.dealSize}
                onChange={handleChange}
                placeholder="Enter estimated deal size"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expectedClosureDate">
                Expected Closure Date
              </label>
              <input
                type="date"
                id="expectedClosureDate"
                name="expectedClosureDate"
                className="form-control"
                value={clientData.expectedClosureDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="createdAt">
                Created At
              </label>
              <input
                type="date"
                id="createdAt"
                name="createdAt"
                className="form-control"
                value={clientData.createdAt}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={clientData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

