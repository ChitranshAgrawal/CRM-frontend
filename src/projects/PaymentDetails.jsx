"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Plus, Trash2, Upload, FileText, Download } from "react-feather"
import "../styles/PaymentDetails.css"

export default function PaymentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paymentStages, setPaymentStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [projectDetails, setProjectDetails] = useState(null)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:3000/projectID/${id}`)
        setProjectDetails(res.data)
        setPaymentStages(res.data.paymentStages || [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching payment details:", err)
        setLoading(false)
      }
    }
    fetchProjectData()
  }, [id])

  const handleStageChange = (index, e) => {
    const { name, value, type } = e.target
    const updatedStages = [...paymentStages]
    updatedStages[index][name] = type === "number" ? Number(value) : value
    setPaymentStages(updatedStages)
  }

  const addPaymentStage = () => {
    setPaymentStages([
      ...paymentStages,
      {
        stageName: "",
        expectedDueDate: "",
        paymentAmount: 0,
        paymentStatus: "Pending",
        file: null,
        invoices: [],
        receipts: [],
      },
    ])
  }

  const removePaymentStage = async (index) => {
    const stageToRemove = paymentStages[index]

    // If stage has an _id, it's already saved in DB
    if (stageToRemove._id) {
      try {
        await axios.delete(`http://localhost:3000/remove-stage/${id}/${stageToRemove._id}`)
        const updatedStages = [...paymentStages]
        updatedStages.splice(index, 1)
        setPaymentStages(updatedStages)
        alert("Stage removed successfully")
      } catch (err) {
        console.error("Error removing stage:", err)
        alert("Failed to remove stage")
      }
    } else {
      // Not saved yet, just remove locally
      const updatedStages = [...paymentStages]
      updatedStages.splice(index, 1)
      setPaymentStages(updatedStages)
    }
  }

  const fetchInvoices = async (index) => {
    try {
      const res = await axios.get(`http://localhost:3000/getInvoices/${id}`)
      const updatedStages = [...paymentStages]
      updatedStages[index].invoices = res.data
      setPaymentStages(updatedStages)
    } catch (err) {
      console.error("Error fetching invoices:", err)
    }
  }

  const submitInvoice = async (e, index) => {
    e.preventDefault()
    const stage = paymentStages[index]
    if (!stage.fileName || !stage.file) {
      alert("Please provide a title and select a file.")
      return
    }

    const formData = new FormData()
    formData.append("title", stage.fileName)
    formData.append("invoice", stage.file)
    formData.append("stageName", stage.stageName)
    formData.append("expectedDueDate", stage.expectedDueDate)
    formData.append("paymentAmount", stage.paymentAmount)
    if (stage._id) formData.append("stageId", stage._id)

    try {
      await axios.post(`http://localhost:3000/upload-invoices/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      fetchInvoices(index)
      alert("Invoice uploaded successfully!")
    } catch (err) {
      console.error(err)
      alert("Upload failed. Please try again.")
    }

    window.location.reload()
  }

  const fetchReceipts = async (index) => {
    try {
      const res = await axios.get(`http://localhost:3000/getReceipts/${id}`)
      const updatedStages = [...paymentStages]
      updatedStages[index].receipts = res.data
      setPaymentStages(updatedStages)
    } catch (err) {
      console.error("Error fetching receipts:", err)
    }
  }

  const submitReceipt = async (e, index) => {
    e.preventDefault()
    const stage = paymentStages[index]

    if (!stage.receiptFileName || !stage.receiptFile) {
      alert("Please provide a title and select a file.")
      return
    }

    const formData = new FormData()
    formData.append("title", stage.receiptFileName)
    formData.append("receipt", stage.receiptFile)
    formData.append("stageName", stage.stageName)
    formData.append("paymentAmount", stage.paymentAmount)
    if (stage._id) formData.append("stageId", stage._id)

    try {
      await axios.post(`http://localhost:3000/upload-receipts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      fetchReceipts(index)
      alert("Receipt uploaded successfully!")
    } catch (err) {
      console.error(err)
      alert("Upload failed. Please try again.")
    }

    window.location.reload()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading payment details...</p>
      </div>
    )
  }

  return (
    <div className="payment-details-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(`/updateProject/${id}`)}>
          <ArrowLeft size={18} />
          <span>Back to Project</span>
        </button>
        <h1>Payment Details</h1>
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

      <div className="payment-stages-container">
        <div className="payment-stages-header">
          <h2>Payment Stages</h2>
          <button type="button" className="btn btn-primary" onClick={addPaymentStage}>
            <Plus size={16} />
            <span>Add Payment Stage</span>
          </button>
        </div>

        {paymentStages.length === 0 ? (
          <div className="no-stages">
            <p>No payment stages defined yet. Click "Add Payment Stage" to create one.</p>
          </div>
        ) : (
          <div className="payment-stages-list">
            {paymentStages.map((stage, index) => (
              <div key={index} className="payment-stage-item">
                <div className="payment-stage-header">
                  <h3>Stage {index + 1}</h3>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removePaymentStage(index)}>
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="payment-stage-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`stageName-${index}`}>
                        Stage Name
                      </label>
                      <input
                        type="text"
                        id={`stageName-${index}`}
                        name="stageName"
                        className="form-control"
                        value={stage.stageName}
                        onChange={(e) => handleStageChange(index, e)}
                        placeholder="Enter stage name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`expectedDueDate-${index}`}>
                        Expected Due Date
                      </label>
                      <input
                        type="date"
                        id={`expectedDueDate-${index}`}
                        name="expectedDueDate"
                        className="form-control"
                        value={stage.expectedDueDate ? stage.expectedDueDate.slice(0, 10) : ""}
                        onChange={(e) => handleStageChange(index, e)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`paymentAmount-${index}`}>
                        Payment Amount
                      </label>
                      <input
                        type="number"
                        id={`paymentAmount-${index}`}
                        name="paymentAmount"
                        className="form-control"
                        value={stage.paymentAmount}
                        onChange={(e) => handleStageChange(index, e)}
                        placeholder="Enter payment amount"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`paymentStatus-${index}`}>
                        Payment Status
                      </label>
                      <select
                        id={`paymentStatus-${index}`}
                        name="paymentStatus"
                        className="form-control"
                        value={stage.paymentStatus}
                        onChange={(e) => handleStageChange(index, e)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Received">Received</option>
                      </select>
                    </div>
                  </div>

                  <div className="documents-section">
                    <div className="invoice-upload">
                      <h4>Invoice Upload</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`fileName-${index}`}>
                            Invoice Title
                          </label>
                          <input
                            type="text"
                            id={`fileName-${index}`}
                            className="form-control"
                            value={stage.fileName || ""}
                            onChange={(e) => {
                              const updatedStages = [...paymentStages]
                              updatedStages[index].fileName = e.target.value
                              setPaymentStages(updatedStages)
                            }}
                            placeholder="Enter invoice title"
                          />
                        </div>

                        <div className="form-group file-upload-group">
                          <label className="form-label" htmlFor={`file-${index}`}>
                            Upload Invoice (PDF)
                          </label>
                          <div className="file-input-container">
                            <input
                              type="file"
                              id={`file-${index}`}
                              accept="application/pdf"
                              className="file-input"
                              onChange={(e) => {
                                const updatedStages = [...paymentStages]
                                updatedStages[index].file = e.target.files[0]
                                setPaymentStages(updatedStages)
                              }}
                            />
                            <div className="file-input-label">
                              <Upload size={16} />
                              <span>{stage.file ? stage.file.name : "Choose a PDF file"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary upload-btn"
                        onClick={(e) => submitInvoice(e, index)}
                      >
                        Upload Invoice
                      </button>

                      <div className="uploaded-files">
                        <h5>Uploaded Invoices</h5>
                        {stage.fileUrl ? (
                          <div className="file-item">
                            <div className="file-icon">
                              <FileText size={16} />
                            </div>
                            <div className="file-details">
                              <div className="file-name">{stage.fileName}</div>
                            </div>
                            <a
                              href={`http://localhost:3000/${stage.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="file-download"
                            >
                              <Download size={16} />
                              <span>Download</span>
                            </a>
                          </div>
                        ) : (
                          <p className="no-files-message">No invoices uploaded yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="receipt-upload">
                      <h4>Receipt Upload</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`receiptFileName-${index}`}>
                            Receipt Title
                          </label>
                          <input
                            type="text"
                            id={`receiptFileName-${index}`}
                            className="form-control"
                            value={stage.receiptFileName || ""}
                            onChange={(e) => {
                              const updatedStages = [...paymentStages]
                              updatedStages[index].receiptFileName = e.target.value
                              setPaymentStages(updatedStages)
                            }}
                            placeholder="Enter receipt title"
                          />
                        </div>

                        <div className="form-group file-upload-group">
                          <label className="form-label" htmlFor={`receiptFile-${index}`}>
                            Upload Receipt (PDF)
                          </label>
                          <div className="file-input-container">
                            <input
                              type="file"
                              id={`receiptFile-${index}`}
                              accept="application/pdf"
                              className="file-input"
                              onChange={(e) => {
                                const updatedStages = [...paymentStages]
                                updatedStages[index].receiptFile = e.target.files[0]
                                setPaymentStages(updatedStages)
                              }}
                            />
                            <div className="file-input-label">
                              <Upload size={16} />
                              <span>{stage.receiptFile ? stage.receiptFile.name : "Choose a PDF file"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary upload-btn"
                        onClick={(e) => submitReceipt(e, index)}
                      >
                        Upload Receipt
                      </button>

                      <div className="uploaded-files">
                        <h5>Uploaded Receipts</h5>
                        {stage.receiptUrl ? (
                          <div className="file-item">
                            <div className="file-icon">
                              <FileText size={16} />
                            </div>
                            <div className="file-details">
                              <div className="file-name">{stage.receiptName}</div>
                            </div>
                            <a
                              href={`http://localhost:3000/${stage.receiptUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="file-download"
                            >
                              <Download size={16} />
                              <span>Download</span>
                            </a>
                          </div>
                        ) : (
                          <p className="no-files-message">No receipts uploaded yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
