"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Save, Plus, Trash2, FileText } from "react-feather"
import "../styles/UpdateProject.css"

export default function UpdateProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    contactNo: "",
    email: "",
    serviceRequirements: "",
    budgetEstimate: "",
    source: "",
    priority: "",
    assignedTo: "",
    salesRep: "",
    projectType: "",
    estimatedCost: "",
    deadline: "",
    projectStartDate: "",
    projectEndDate: "",
    paymentStatus: "",
    status: "",
    createdAt: "",
    assignedTeamMembers: [],
    invoiceGenerated: false,
  })
  const [paymentStages, setPaymentStages] = useState([])

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:3000/projectID/${id}`)
      .then((res) => {
        // Format dates for input fields
        const data = { ...res.data }
        if (data.deadline) data.deadline = data.deadline.slice(0, 10)
        if (data.projectStartDate) data.projectStartDate = data.projectStartDate.slice(0, 10)
        if (data.projectEndDate) data.projectEndDate = data.projectEndDate.slice(0, 10)
        if (data.createdAt) data.createdAt = data.createdAt.slice(0, 10)

        setFormData(data)
        setPaymentStages(data.paymentStages || [])
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? Number(value) : "") : value,
    })
  }

  const handleStageChange = (index, e) => {
    const { name, value, type } = e.target
    const updatedStages = [...paymentStages]
    updatedStages[index][name] = type === "number" ? (value ? Number(value) : 0) : value
    setPaymentStages(updatedStages)
  }

  const addPaymentStage = () => {
    setPaymentStages([
      ...paymentStages,
      { stageName: "", expectedDueDate: "", paymentAmount: 0, paymentStatus: "Pending" },
    ])
  }

  const removePaymentStage = (index) => {
    const updatedStages = [...paymentStages]
    updatedStages.splice(index, 1)
    setPaymentStages(updatedStages)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setSaving(true)

    axios
      .put(`http://localhost:3000/updateProject/${id}`, {
        ...formData,
        paymentStages,
      })
      .then(() => {
        setSaving(false)
        alert("Project updated successfully!")
        navigate("/projects")
      })
      .catch((err) => {
        console.log(err)
        setSaving(false)
        alert("Failed to update project. Please try again.")
      })
  }

  const totalPaymentAmount = paymentStages.reduce((acc, stage) => acc + (stage.paymentAmount || 0), 0)

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project data...</p>
      </div>
    )
  }

  return (
    <div className="update-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/projects")}>
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </button>
        <h1>Update Project</h1>
      </div>

      <div className="form-container">
        <div className="form-header">
          <h2>Project Information</h2>
          <div className="project-id-display">
            <span>Project ID:</span>
            <strong>{formData.leadID || id}</strong>
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
                value={formData.clientName}
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
                value={formData.companyName}
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
                value={formData.contactNo}
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projectType">
                Project Type
              </label>
              <input
                type="text"
                id="projectType"
                name="projectType"
                className="form-control"
                value={formData.projectType}
                onChange={handleChange}
                placeholder="Enter project type"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="estimatedCost">
                Estimated Cost
              </label>
              <input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                className="form-control"
                value={formData.estimatedCost}
                onChange={handleChange}
                placeholder="Enter estimated cost"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="budgetEstimate">
                Budget Estimate
              </label>
              <input
                type="number"
                id="budgetEstimate"
                name="budgetEstimate"
                className="form-control"
                value={formData.budgetEstimate}
                onChange={handleChange}
                placeholder="Enter budget estimate"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deadline">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projectStartDate">
                Project Start Date
              </label>
              <input
                type="date"
                id="projectStartDate"
                name="projectStartDate"
                className="form-control"
                value={formData.projectStartDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="projectEndDate">
                Project End Date
              </label>
              <input
                type="date"
                id="projectEndDate"
                name="projectEndDate"
                className="form-control"
                value={formData.projectEndDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Enter assignee name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="assignedTeamMembers">
                Assigned Team Members (comma separated)
              </label>
              <input
                type="text"
                id="assignedTeamMembers"
                name="assignedTeamMembers"
                className="form-control"
                value={formData.assignedTeamMembers ? formData.assignedTeamMembers.join(", ") : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedTeamMembers: e.target.value.split(",").map((member) => member.trim()),
                  })
                }
                placeholder="Enter team members"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="invoiceGenerated">
                Invoice Generated
              </label>
              <select
                id="invoiceGenerated"
                name="invoiceGenerated"
                className="form-control"
                value={formData.invoiceGenerated ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    invoiceGenerated: e.target.value === "true",
                  })
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="serviceRequirements">
              Service Requirements
            </label>
            <textarea
              id="serviceRequirements"
              name="serviceRequirements"
              className="form-control"
              value={formData.serviceRequirements}
              onChange={handleChange}
              placeholder="Enter service requirements"
              rows="4"
            ></textarea>
          </div>

          <div className="payment-stages-section">
            <div className="payment-stages-header">
              <h3>Payment Stages</h3>
              <button type="button" className="btn btn-outline btn-sm" onClick={addPaymentStage}>
                <Plus size={16} />
                <span>Add Stage</span>
              </button>
            </div>

            {paymentStages.length === 0 ? (
              <div className="no-stages-message">No payment stages defined yet.</div>
            ) : (
              <div className="payment-stages-list">
                {paymentStages.map((stage, index) => (
                  <div key={index} className="payment-stage-item">
                    <div className="payment-stage-header">
                      <h4>Stage {index + 1}</h4>
                      <button
                        type="button"
                        className="btn btn-icon btn-danger btn-sm"
                        onClick={() => removePaymentStage(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="payment-stage-form">
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
                  </div>
                ))}
              </div>
            )}

            <div className="payment-summary">
              <p>
                <strong>Total Payment Amount:</strong> ${totalPaymentAmount}
              </p>
            </div>
          </div>

          <div className="form-actions">
            <div className="additional-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(`/payment-details/${id}`)}>
                <Plus size={16} />
                <span>Payment Details</span>
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate(`/invoice/${id}`)}>
                <FileText size={16} />
                <span>Generate Invoice</span>
              </button>
            </div>
            <div className="main-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate("/projects")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

