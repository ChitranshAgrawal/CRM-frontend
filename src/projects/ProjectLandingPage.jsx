"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import MUIDataTable from "mui-datatables"
import { Menu, MenuItem, IconButton, Checkbox, FormControlLabel, Tooltip, Button, Popover } from "@mui/material"
import { ViewColumn, Delete, Edit, Add, FileCopy as FileText, KeyboardArrowDown } from "@mui/icons-material"
import axios from "axios"
import { formatDate } from "../leads/Utils"
import "../styles/ProjectLandingPage.css"

export default function ProjectLandingPage() {
  const [projects, setProjects] = useState([])
  const [columns, setColumns] = useState([])
  const [visibleColumns, setVisibleColumns] = useState({})
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null)
  const [statusAnchorEl, setStatusAnchorEl] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:3000/getProjects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error fetching projects:", error))
  }, [])

  useEffect(() => {
    const initialColumns = [
      {
        name: "leadID",
        label: "Project ID",
        options: {
          customBodyRender: (value, tableMeta) => {
            const mongoId = projects[tableMeta.rowIndex]?._id
            const projectId = value || mongoId

            return (
              <Tooltip title="Click to view details" placement="top">
                <div onClick={() => navigate(`/project/${mongoId}`)} className="project-id-link">
                  {projectId}
                </div>
              </Tooltip>
            )
          },
        },
      },
      { name: "clientName", label: "Client Name" },
      { name: "companyName", label: "Company" },
      { name: "contactNo", label: "Contact" },
      { name: "projectType", label: "Project Type" },
      {
        name: "estimatedCost",
        label: "Estimated Cost",
        options: {
          customBodyRender: (value) => (value ? `$${value}` : "-"),
        },
      },
      {
        name: "budgetEstimate",
        label: "Budget Estimate",
        options: {
          customBodyRender: (value) => (value ? `$${value}` : "-"),
        },
      },
      { name: "deadline", label: "Deadline", isDate: true },
      {
        name: "paymentStages",
        label: "Payment Stage Status",
        options: {
          customBodyRender: (value) => {
            if (!value || value.length === 0) return "-"
            const received = value.filter((stage) => stage.paymentStatus === "Received").length
            return `${received}/${value.length}`
          },
        },
      },
      { name: "projectStartDate", label: "Project Start Date", isDate: true },
      {
        name: "assignedTeamMembers",
        label: "Assigned Team Members",
        options: {
          customBodyRender: (value) => {
            return value && value.length > 0 ? value.join(", ") : "-"
          },
        },
      },
      {
        name: "status",
        label: "Status",
        options: {
          customBodyRender: (value, tableMeta) => {
            let className = "status-badge "
            if (value === "In Progress") className += "interested"
            else if (value === "Completed") className += "converted"
            else if (value === "On Hold") className += "warning"
            else if (value === "Cancelled") className += "not-interested"
            else className += "new"

            const project = projects[tableMeta.rowIndex]

            return (
              <div className="editable-cell" onClick={(e) => handleStatusClick(e, project)}>
                <span className={className}>{value}</span>
                <KeyboardArrowDown className="dropdown-icon" fontSize="small" />
              </div>
            )
          },
        },
      },
    ]

    setColumns(initialColumns)

    // Set default visible columns - only show important ones initially
    const initialVisibility = initialColumns.reduce((acc, col) => {
      // Only show these columns by default
      const defaultVisible = ["leadID", "clientName", "status", "deadline", "projectStartDate"].includes(col.name)

      acc[col.name] = defaultVisible
      return acc
    }, {})

    setVisibleColumns(initialVisibility)
  }, [projects, navigate])

  const handleColumnToggle = (columnName) => {
    setVisibleColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }))
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      axios
        .delete(`http://localhost:3000/deleteProject/${id}`)
        .then(() => {
          setProjects((prev) => prev.filter((project) => project._id !== id))
        })
        .catch((err) => console.log("Error deleting project:", err))
    }
  }

  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget)
  }

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null)
  }

  // Status dropdown handlers
  const handleStatusClick = (event, project) => {
    event.stopPropagation()
    setSelectedProject(project)
    setStatusAnchorEl(event.currentTarget)
  }

  const handleStatusClose = () => {
    setStatusAnchorEl(null)
  }

  const handleStatusChange = (newStatus) => {
    if (!selectedProject || isUpdating) return

    setIsUpdating(true)

    axios
      .put(`http://localhost:3000/updateProject/${selectedProject._id}`, {
        ...selectedProject,
        status: newStatus,
      })
      .then(() => {
        // Update local state
        setProjects(
          projects.map((project) =>
            project._id === selectedProject._id ? { ...project, status: newStatus } : project,
          ),
        )
        setIsUpdating(false)
        handleStatusClose()
      })
      .catch((err) => {
        console.error("Error updating status:", err)
        setIsUpdating(false)
        handleStatusClose()
      })
  }

  const tableColumns = columns
    .filter((col) => visibleColumns[col.name])
    .map((col) => ({
      name: col.name,
      label: col.label,
      options: {
        filter: true,
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
        const project = projects[tableMeta.rowIndex]
        return (
          <div className="action-buttons">
            <Tooltip title="Edit" placement="top">
              <IconButton onClick={() => navigate(`/updateProject/${project?._id}`)} className="edit-button">
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton onClick={() => handleDelete(project?._id)} className="delete-button">
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate Invoice" placement="top">
              <IconButton onClick={() => window.open("https://google.com", "_blank")} className="quote-button">
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
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects Management</h1>
        <div className="page-actions">
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/createProject"
            className="add-project-button"
          >
            Add New Project
          </Button>
        </div>
      </div>

      <div className="projects-stats">
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Total Projects</h3>
            <p className="stat-card-value">{projects.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">In Progress</h3>
            <p className="stat-card-value">{projects.filter((project) => project.status === "In Progress").length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Completed</h3>
            <p className="stat-card-value">{projects.filter((project) => project.status === "Completed").length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Completion Rate</h3>
            <p className="stat-card-value">
              {projects.length
                ? `${Math.round((projects.filter((project) => project.status === "Completed").length / projects.length) * 100)}%`
                : "0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="projects-table-container">
        <MUIDataTable title="" data={projects} columns={tableColumns} options={options} />
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
            className={`menu-item ${selectedProject?.status === "New" ? "active" : ""}`}
          >
            <span className="status-badge new">New</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("In Progress")}
            className={`menu-item ${selectedProject?.status === "In Progress" ? "active" : ""}`}
          >
            <span className="status-badge interested">In Progress</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("On Hold")}
            className={`menu-item ${selectedProject?.status === "On Hold" ? "active" : ""}`}
          >
            <span className="status-badge warning">On Hold</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("Completed")}
            className={`menu-item ${selectedProject?.status === "Completed" ? "active" : ""}`}
          >
            <span className="status-badge converted">Completed</span>
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("Cancelled")}
            className={`menu-item ${selectedProject?.status === "Cancelled" ? "active" : ""}`}
          >
            <span className="status-badge not-interested">Cancelled</span>
          </MenuItem>
        </div>
      </Popover>
    </div>
  )
}

