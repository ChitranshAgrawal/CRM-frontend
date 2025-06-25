"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import MUIDataTable from "mui-datatables"
import { Menu, MenuItem, IconButton, Checkbox, FormControlLabel, Tooltip, Button, Popover } from "@mui/material"
import { ViewColumn, Delete, Edit, Add, FileCopy as FileText, KeyboardArrowDown } from "@mui/icons-material"
import axios from "axios"
import { formatDate, filterableColumns, isLeadNewByClick } from "./Utils"
import "../styles/LeadsLandingPage.css"

// Update the component to include dropdown functionality
export default function LeadsLandingPage() {
  const [clients, setClients] = useState([])
  const [columns, setColumns] = useState([])
  const [visibleColumns, setVisibleColumns] = useState({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null)
  const [statusAnchorEl, setStatusAnchorEl] = useState(null)
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const navigate = useNavigate()

  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";


  useEffect(() => {
    axios
      .get(`${url}/leads`)
      .then((response) => setClients(response.data))
      .catch((error) => console.error("Error fetching clients:", error))
  }, [])

  useEffect(() => {
    const initialColumns = [
      {
        name: "leadID",
        label: "Lead ID",
        options: {
          customBodyRender: (value, tableMeta) => {
            const mongoId = clients[tableMeta.rowIndex]?._id
            const client = clients[tableMeta.rowIndex]
            const showNewBadge = isLeadNewByClick(client?.leadID)

            const handleLeadClick = () => {
              const clickedLeads = JSON.parse(localStorage.getItem("clickedLeads") || "[]")
              if (!clickedLeads.includes(client?.leadID)) {
                clickedLeads.push(client?.leadID)
                localStorage.setItem("clickedLeads", JSON.stringify(clickedLeads))
              }
              return navigate(`/display/${mongoId}`)
            }

            return (
              <Tooltip title="Click to view details" placement="top">
                <div onClick={handleLeadClick} className="lead-id-link">
                  {value}
                  {showNewBadge && <span className="new-badge">NEW</span>}
                </div>
              </Tooltip>
            )
          },
        },
      },
      { name: "clientName", label: "Client Name" },
      { name: "companyName", label: "Company" },
      { name: "email", label: "Email" },
      { name: "contactNo", label: "Contact" },
      { name: "source", label: "Source" },
      {
        name: "priority",
        label: "Priority",
        options: {
          customBodyRender: (value, tableMeta) => {
            let className = "status-badge "
            if (value === "High") className += "high"
            else if (value === "Medium") className += "medium"
            else className += "low"

            const client = clients[tableMeta.rowIndex]

            return (
              <div className="editable-cell" onClick={(e) => handlePriorityClick(e, client)}>
                <span className={className}>{value}</span>
                <KeyboardArrowDown className="dropdown-icon" fontSize="small" />
              </div>
            )
          },
        },
      },
      {
        name: "status",
        label: "Status",
        options: {
          customBodyRender: (value, tableMeta) => {
            let className = "status-badge "
            if (value === "New") className += "new"
            else if (value === "Interested") className += "interested"
            else if (value === "Converted") className += "converted"
            else if (value === "Not Interested") className += "not-interested"
            else className += "rejected"

            const client = clients[tableMeta.rowIndex]

            return (
              <div className="editable-cell" onClick={(e) => handleStatusClick(e, client)}>
                <span className={className}>{value}</span>
                <KeyboardArrowDown className="dropdown-icon" fontSize="small" />
              </div>
            )
          },
        },
      },
      { name: "assignedTo", label: "Assigned To" },
      { name: "salesRep", label: "Sales Rep" },
      { name: "followUpDate", label: "Follow-up Date", isDate: true },
      {
        name: "dealSize",
        label: "Deal Size",
        options: {
          customBodyRender: (value) => (value ? `$${value}` : "-"),
        },
      },
      { name: "createdAt", label: "Created At", isDate: true },
    ]

    setColumns(initialColumns)

    // Set default visible columns - only show important ones initially
    const initialVisibility = initialColumns.reduce((acc, col) => {
      // Only show these columns by default
      const defaultVisible = ["leadID", "clientName", "status", "priority", "createdAt", "followUpDate"].includes(
        col.name,
      )

      acc[col.name] = defaultVisible
      return acc
    }, {})

    setVisibleColumns(initialVisibility)
  }, [clients, navigate])

  const handleColumnToggle = (columnName) => {
    setVisibleColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }))
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      axios
        .delete(`${url}/leads/${id}`)
        .then(() => setClients((prev) => prev.filter((client) => client._id !== id)))
        .catch((err) => console.log(err))
    }
  }

  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget)
  }

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null)
  }

  // Status dropdown handlers
  const handleStatusClick = (event, client) => {
    event.stopPropagation()
    setSelectedClient(client)
    setStatusAnchorEl(event.currentTarget)
  }

  const handleStatusClose = () => {
    setStatusAnchorEl(null)
  }

  const handleStatusChange = (newStatus) => {
    if (!selectedClient || isUpdating) return

    // Add confirmation dialog
    if (!window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
      handleStatusClose()
      return
    }

    setIsUpdating(true)

    axios
      .put(`${url}/leads/${selectedClient._id}`, {
        ...selectedClient,
        status: newStatus,
      })
      .then(() => {
        // Update local state
        setClients(
          clients.map((client) => (client._id === selectedClient._id ? { ...client, status: newStatus } : client)),
        )
        setIsUpdating(false)
        handleStatusClose()

        // Redirect to projects if status is Converted
        if (newStatus === "Converted") {
          navigate("/projects")
        }
      })
      .catch((err) => {
        console.error("Error updating status:", err)
        setIsUpdating(false)
        handleStatusClose()
      })
  }

  // Priority dropdown handlers
  const handlePriorityClick = (event, client) => {
    event.stopPropagation()
    setSelectedClient(client)
    setPriorityAnchorEl(event.currentTarget)
  }

  const handlePriorityClose = () => {
    setPriorityAnchorEl(null)
  }

  const handlePriorityChange = (newPriority) => {
    if (!selectedClient || isUpdating) return

    // Add confirmation dialog
    if (!window.confirm(`Are you sure you want to change the priority to "${newPriority}"?`)) {
      handlePriorityClose()
      return
    }

    setIsUpdating(true)

    axios
      .put(`${url}/leads/${selectedClient._id}`, {
        ...selectedClient,
        priority: newPriority,
      })
      .then(() => {
        // Update local state
        setClients(
          clients.map((client) => (client._id === selectedClient._id ? { ...client, priority: newPriority } : client)),
        )
        setIsUpdating(false)
        handlePriorityClose()
      })
      .catch((err) => {
        console.error("Error updating priority:", err)
        setIsUpdating(false)
        handlePriorityClose()
      })
  }

  const tableColumns = columns
    .filter((col) => visibleColumns[col.name])
    .map((col) => ({
      name: col.name,
      label: col.label,
      options: {
        filter: filterableColumns.includes(col.name),
        sort: true,
        ...col.options,
        customBodyRender:
          col.options?.customBodyRender ||
          ((value) => {
            if (col.isDate) {
              return formatDate(value)
            }
            return value || "-"
          }),
      },
    }))

  tableColumns.push({
    name: "actions",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        const client = clients[tableMeta.rowIndex]
        return (
          <div className="action-buttons">
            <Tooltip title="Edit" placement="top">
              <IconButton onClick={() => navigate(`/update/${client?._id}`)} className="edit-button">
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton onClick={() => handleDelete(client?._id)} className="delete-button">
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Quote" placement="top">
              <IconButton onClick={() => navigate(`/pdf-files/${client?._id}`)} className="quote-button">
                <FileText fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )
      },
    },
  })

  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "standard",
    print: false,
    download: true,
    viewColumns: false, // Disable built-in view columns button
    filter: true,
    elevation: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    customToolbar: () => (
      <div className="custom-toolbar">
        <Tooltip title="View Columns">
          <IconButton onClick={handleColumnMenuOpen} className="toolbar-button">
            <ViewColumn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={columnMenuAnchor}
          open={Boolean(columnMenuAnchor)}
          onClose={handleColumnMenuClose}
          className="column-menu"
        >
          {columns.map((col) => (
            <MenuItem key={col.name} className="column-menu-item">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleColumns[col.name]}
                    onChange={() => handleColumnToggle(col.name)}
                    size="small"
                  />
                }
                label={col.label}
              />
            </MenuItem>
          ))}
        </Menu>
      </div>
    ),
    setTableProps: () => {
      return {
        className: "custom-mui-table",
      }
    },
  }

  return (
    <div className="leads-page">
      <div className="page-header">
        <h1>Leads Management</h1>
        <div className="page-actions">
          <Button variant="contained" startIcon={<Add />} component={Link} to="/create" className="add-lead-button">
            Add New Lead
          </Button>
        </div>
      </div>

      <div className="leads-stats">
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Total Leads</h3>
            <p className="stat-card-value">{clients.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">New Leads</h3>
            <p className="stat-card-value">{clients.filter((client) => client.status === "New").length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Converted</h3>
            <p className="stat-card-value">{clients.filter((client) => client.status === "Converted").length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Conversion Rate</h3>
            <p className="stat-card-value">
              {clients.length
                ? `${Math.round((clients.filter((client) => client.status === "Converted").length / clients.length) * 100)}%`
                : "0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="leads-table-container">
        <MUIDataTable title="" data={clients} columns={tableColumns} options={options} />
      </div>

      {/* Status Dropdown */}
      <Popover
        open={Boolean(statusAnchorEl)}
        anchorEl={statusAnchorEl}
        onClose={handleStatusClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        className="status-popover"
      >
        <div className="dropdown-menu">
          <div className="dropdown-menu-title">Change Status</div>
          <MenuItem
            onClick={() => handleStatusChange("New")}
            className={`menu-item ${selectedClient?.status === "New" ? "active" : ""}`}
          >
            <span className="status-badge new">New</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("Interested")}
            className={`menu-item ${selectedClient?.status === "Interested" ? "active" : ""}`}
          >
            <span className="status-badge interested">Interested</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("Not Interested")}
            className={`menu-item ${selectedClient?.status === "Not Interested" ? "active" : ""}`}
          >
            <span className="status-badge not-interested">Not Interested</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("Converted")}
            className={`menu-item ${selectedClient?.status === "Converted" ? "active" : ""}`}
          >
            <span className="status-badge converted">Converted</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("Rejected")}
            className={`menu-item ${selectedClient?.status === "Rejected" ? "active" : ""}`}
          >
            <span className="status-badge rejected">Rejected</span>
          </MenuItem>
        </div>
      </Popover>

      {/* Priority Dropdown */}
      <Popover
        open={Boolean(priorityAnchorEl)}
        anchorEl={priorityAnchorEl}
        onClose={handlePriorityClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        className="priority-popover"
      >
        <div className="dropdown-menu">
          <div className="dropdown-menu-title">Change Priority</div>
          <MenuItem
            onClick={() => handlePriorityChange("High")}
            className={`menu-item ${selectedClient?.priority === "High" ? "active" : ""}`}
          >
            <span className="status-badge high">High</span>
          </MenuItem>
          <MenuItem
            onClick={() => handlePriorityChange("Medium")}
            className={`menu-item ${selectedClient?.priority === "Medium" ? "active" : ""}`}
          >
            <span className="status-badge medium">Medium</span>
          </MenuItem>
          <MenuItem
            onClick={() => handlePriorityChange("Low")}
            className={`menu-item ${selectedClient?.priority === "Low" ? "active" : ""}`}
          >
            <span className="status-badge low">Low</span>
          </MenuItem>
        </div>
      </Popover>
    </div>
  )
}

