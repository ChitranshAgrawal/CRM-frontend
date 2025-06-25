"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Upload, FileText, Download } from "react-feather"
import "../styles/Invoice.css"

export default function Invoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [uploading, setUploading] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [projectDetails, setProjectDetails] = useState(null)

  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch project information
  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const res = await axios.get(`${url}/project/${id}`)
        setProjectDetails(res.data)
      } catch (err) {
        console.error("Error fetching project info:", err)
      }
    }

    fetchProjectInfo()
  }, [id])

  // Fetch invoices from backend
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${url}/invoice/${id}`)
      setInvoices(res.data)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setMessage("Failed to load invoices.")
      setMessageType("error")
    }
  }

  // Fetch invoices when component loads
  useEffect(() => {
    fetchInvoices()
  }, [id])

  // Handle invoice upload
  const submitInvoice = async (e) => {
    e.preventDefault()
    if (!title || !file) {
      setMessage("Please provide a title and select a file.")
      setMessageType("error")
      return
    }
    setUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)

    try {
      await axios.post(`${url}/invoice/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setMessage("Invoice uploaded successfully!")
      setMessageType("success")
      setTitle("")
      setFile(null)
      // Reset the file input
      document.getElementById("file-upload").value = ""
      fetchInvoices() // Refresh invoice list after upload
    } catch (err) {
      console.error(err)
      setMessage("Upload failed. Please try again.")
      setMessageType("error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="invoice-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(`/project/${id}`)}>
          <ArrowLeft size={18} />
          <span>Back to Project</span>
        </button>
        <h1>Invoice Management</h1>
      </div>

      {projectDetails && (
        <div className="project-info-card">
          <div className="project-info-header">
            <h2>Project Information</h2>
            <span className="project-id">{projectDetails.leadID || projectDetails._id}</span>
          </div>
          <div className="project-info-content">
            <div className="project-info-item">
              <span className="info-label">Client Name:</span>
              <span className="info-value">{projectDetails.clientName}</span>
            </div>
            {projectDetails.companyName && (
              <div className="project-info-item">
                <span className="info-label">Company:</span>
                <span className="info-value">{projectDetails.companyName}</span>
              </div>
            )}
            <div className="project-info-item">
              <span className="info-label">Project Type:</span>
              <span className="info-value">{projectDetails.projectType || "Not specified"}</span>
            </div>
            <div className="project-info-item">
              <span className="info-label">Estimated Cost:</span>
              <span className="info-value">
                {projectDetails.estimatedCost ? `$${projectDetails.estimatedCost}` : "Not specified"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="invoice-container">
        <div className="upload-section">
          <h2>Upload New Invoice</h2>
          <form onSubmit={submitInvoice}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Invoice Title
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="Enter invoice title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="file-upload">
                Select PDF File
              </label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="file-upload"
                  accept="application/pdf"
                  className="file-input"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="file-input-label">
                  <Upload size={16} />
                  <span>{file ? file.name : "Choose a PDF file"}</span>
                </div>
              </div>
            </div>

            {message && <div className={`message ${messageType}`}>{message}</div>}

            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Invoice"}
            </button>
          </form>
        </div>

        <div className="files-section">
          <h2>Uploaded Invoices</h2>
          {invoices.length === 0 ? (
            <div className="no-files">
              <FileText size={48} />
              <p>No invoices have been uploaded yet.</p>
            </div>
          ) : (
            <div className="files-list">
              {invoices.map((invoice, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon">
                    <FileText size={24} />
                  </div>
                  <div className="file-details">
                    <div className="file-name">{invoice.fileName}</div>
                    <div className="file-date">Uploaded on {new Date(invoice.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <a
                    href={`${url}/invoices/${invoice.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-download"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

