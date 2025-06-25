"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Upload, FileText, Download } from "react-feather"
import "../styles/Quotation.css"

export default function Quotation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const [clientInfo, setClientInfo] = useState(null)

  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch client information
  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const res = await axios.get(`${url}/leads/${id}`)
        setClientInfo(res.data)
      } catch (err) {
        console.error("Error fetching client info:", err)
      }
    }

    fetchClientInfo()
  }, [id])

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${url}/quotation/${id}`)
      setFiles(res.data)
    } catch (err) {
      console.error("Error fetching files:", err)
      setMessage("Failed to load files.")
      setMessageType("error")
    }
  }

  // Fetch files when component loads
  useEffect(() => {
    fetchFiles()
  }, [id])

  // Handle file upload
  const submitQuotation = async (e) => {
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
      await axios.post(`${url}/quotation/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setMessage("Quotation uploaded successfully!")
      setMessageType("success")
      setTitle("")
      setFile(null)
      // Reset the file input
      document.getElementById("file-upload").value = ""
      fetchFiles() // Refresh file list after upload
    } catch (err) {
      console.error(err)
      setMessage("Upload failed. Please try again.")
      setMessageType("error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="quotation-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Back to Leads</span>
        </button>
        <h1>Quotation Management</h1>
      </div>

      {clientInfo && (
        <div className="client-info-card">
          <div className="client-info-header">
            <h2>Client Information</h2>
            <span className="lead-id">{clientInfo.leadID}</span>
          </div>
          <div className="client-info-content">
            <div className="client-info-item">
              <span className="info-label">Client Name:</span>
              <span className="info-value">{clientInfo.clientName}</span>
            </div>
            {clientInfo.companyName && (
              <div className="client-info-item">
                <span className="info-label">Company:</span>
                <span className="info-value">{clientInfo.companyName}</span>
              </div>
            )}
            <div className="client-info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{clientInfo.email}</span>
            </div>
            <div className="client-info-item">
              <span className="info-label">Contact:</span>
              <span className="info-value">{clientInfo.contactNo}</span>
            </div>
          </div>
        </div>
      )}

      <div className="quotation-container">
        <div className="upload-section">
          <h2>Upload New Quotation</h2>
          <form onSubmit={submitQuotation}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Quotation Title
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="Enter quotation title"
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
              {uploading ? "Uploading..." : "Upload Quotation"}
            </button>
          </form>
        </div>

        <div className="files-section">
          <h2>Uploaded Quotations</h2>
          {files.length === 0 ? (
            <div className="no-files">
              <FileText size={48} />
              <p>No quotations have been uploaded yet.</p>
            </div>
          ) : (
            <div className="files-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon">
                    <FileText size={24} />
                  </div>
                  <div className="file-details">
                    <div className="file-name">{file.fileName}</div>
                    <div className="file-date">Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <a
                    href={`${url}/files/${file.fileName}`}
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

