"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Tag,
  Flag,
  Clock,
  DollarSign,
  FileText,
} from "react-feather"
import { formatDate } from "./Utils"
import "../styles/Display.css"

export default function Display() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leadDetails, setLeadDetails] = useState({})
  const [loading, setLoading] = useState(true)

  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${url}/leads/${id}`)
      .then((response) => {
        setLeadDetails(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Error fetching lead details:", error)
        setLoading(false)
      })
  }, [id])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      axios
        .delete(`${url}/leads/${id}`)
        .then(() => {
          alert("Lead deleted successfully")
          navigate("/")
        })
        .catch((err) => console.log(err))
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading lead details...</p>
      </div>
    )
  }

  return (
    <div className="lead-details-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Back to Leads</span>
        </button>
        <h1>Lead Details</h1>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/update/${id}`)}>
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="lead-details-container">
        <div className="lead-header">
          <div className="lead-title">
            <h2>{leadDetails.clientName}</h2>
            <div className="lead-subtitle">
              {leadDetails.companyName && <span className="company-name">{leadDetails.companyName}</span>}
              <span className="lead-id">{leadDetails.leadID}</span>
            </div>
          </div>
          <div className="lead-status">
            <div className={`status-badge ${leadDetails.status?.toLowerCase()}`}>{leadDetails.status}</div>
            <div className={`priority-badge ${leadDetails.priority?.toLowerCase()}`}>
              {leadDetails.priority} Priority
            </div>
          </div>
        </div>

        <div className="lead-details-grid">
          <div className="detail-card">
            <h3 className="detail-card-title">Contact Information</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <User size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Client Name</span>
                  <span className="detail-value">{leadDetails.clientName}</span>
                </div>
              </div>

              {leadDetails.companyName && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <Briefcase size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{leadDetails.companyName}</span>
                  </div>
                </div>
              )}

              <div className="detail-item">
                <div className="detail-icon">
                  <Phone size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Contact Number</span>
                  <span className="detail-value">{leadDetails.contactNo}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Mail size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{leadDetails.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Lead Information</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <Tag size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Source</span>
                  <span className="detail-value">{leadDetails.source || "Not specified"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <User size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Assigned To</span>
                  <span className="detail-value">{leadDetails.assignedTo || "Not assigned"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <User size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Sales Representative</span>
                  <span className="detail-value">{leadDetails.salesRep || "Not assigned"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Flag size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Mode of Contact</span>
                  <span className="detail-value">{leadDetails.mode || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Timeline</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Created At</span>
                  <span className="detail-value">{formatDate(leadDetails.createdAt)}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <User size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Created By</span>
                  <span className="detail-value">{leadDetails.createdBy || "Not specified"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Follow-up Date</span>
                  <span className="detail-value">{formatDate(leadDetails.followUpDate) || "Not scheduled"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Clock size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Expected Closure</span>
                  <span className="detail-value">{formatDate(leadDetails.expectedClosureDate) || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Deal Information</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <DollarSign size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Deal Size</span>
                  <span className="detail-value">
                    {leadDetails.dealSize ? `$${leadDetails.dealSize}` : "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {leadDetails.notes && (
          <div className="notes-section">
            <h3 className="notes-title">
              <FileText size={16} />
              <span>Notes</span>
            </h3>
            <div className="notes-content">{leadDetails.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}

