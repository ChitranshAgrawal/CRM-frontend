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
  DollarSign,
  FileText,
  Users,
} from "react-feather"
import { formatDate } from "../leads/Utils"
import "../styles/DisplayProject.css"

export default function DisplayProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projectDetails, setProjectDetails] = useState({})
  const [loading, setLoading] = useState(true)

  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${url}/project/${id}`)
      .then((response) => {
        setProjectDetails(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Error fetching project details:", error)
        setLoading(false)
      })
  }, [id])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      axios
        .delete(`${url}/project/${id}`)
        .then(() => {
          alert("Project deleted successfully")
          navigate("/projects")
        })
        .catch((err) => console.log(err))
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    )
  }

  return (
    <div className="project-details-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/projects")}>
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </button>
        <h1>Project Details</h1>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/project/${id}`)}>
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button className="btn btn-outline" onClick={() => navigate(`/invoice/${id}`)}>
            <FileText size={16} />
            <span>Generate Invoice</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="project-details-container">
        <div className="project-header">
          <div className="project-title">
            <h2>{projectDetails.clientName}</h2>
            <div className="project-subtitle">
              {projectDetails.companyName && <span className="company-name">{projectDetails.companyName}</span>}
              <span className="project-id">{projectDetails.leadID || projectDetails._id}</span>
            </div>
          </div>
          <div className="project-status">
            <div className={`status-badge ${projectDetails.status?.toLowerCase().replace(/\s+/g, "-")}`}>
              {projectDetails.status}
            </div>
          </div>
        </div>

        <div className="project-details-grid">
          <div className="detail-card">
            <h3 className="detail-card-title">Client Information</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <User size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Client Name</span>
                  <span className="detail-value">{projectDetails.clientName}</span>
                </div>
              </div>

              {projectDetails.companyName && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <Briefcase size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{projectDetails.companyName}</span>
                  </div>
                </div>
              )}

              <div className="detail-item">
                <div className="detail-icon">
                  <Phone size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Contact Number</span>
                  <span className="detail-value">{projectDetails.contactNo}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Mail size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{projectDetails.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Project Information</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <Tag size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Project Type</span>
                  <span className="detail-value">{projectDetails.projectType || "Not specified"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Start Date</span>
                  <span className="detail-value">{formatDate(projectDetails.projectStartDate) || "Not specified"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Deadline</span>
                  <span className="detail-value">{formatDate(projectDetails.deadline) || "Not specified"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Users size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Assigned Team</span>
                  <span className="detail-value">
                    {projectDetails.assignedTeamMembers?.join(", ") || "Not assigned"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-card-title">Financial Information</h3>
            <div className="detail-card-content">
              <div className="detail-item">
                <div className="detail-icon">
                  <DollarSign size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Estimated Cost</span>
                  <span className="detail-value">
                    {projectDetails.estimatedCost ? `$${projectDetails.estimatedCost}` : "Not specified"}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <DollarSign size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Budget Estimate</span>
                  <span className="detail-value">
                    {projectDetails.budgetEstimate ? `$${projectDetails.budgetEstimate}` : "Not specified"}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Flag size={16} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Invoice Generated</span>
                  <span className="detail-value">{projectDetails.invoiceGenerated ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {projectDetails.paymentStages && projectDetails.paymentStages.length > 0 && (
          <div className="payment-stages-section">
            <h3 className="payment-stages-title">
              <DollarSign size={16} />
              <span>Payment Stages</span>
            </h3>
            <div className="payment-stages-table">
              <table>
                <thead>
                  <tr>
                    <th>Stage Name</th>
                    <th>Expected Due Date</th>
                    <th>Payment Amount</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectDetails.paymentStages.map((stage, index) => (
                    <tr key={index}>
                      <td>{stage.stageName}</td>
                      <td>{formatDate(stage.expectedDueDate)}</td>
                      <td>${stage.paymentAmount}</td>
                      <td>
                        <span className={`status-badge ${stage.paymentStatus.toLowerCase()}`}>
                          {stage.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {projectDetails.serviceRequirements && (
          <div className="notes-section">
            <h3 className="notes-title">
              <FileText size={16} />
              <span>Service Requirements</span>
            </h3>
            <div className="notes-content">{projectDetails.serviceRequirements}</div>
          </div>
        )}
      </div>
    </div>
  )
}

