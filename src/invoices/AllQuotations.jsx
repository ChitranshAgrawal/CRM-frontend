"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FileText, Download, Search } from "react-feather"
import "../styles/AllQuotations.css"

export default function AllQuotations() {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredQuotations, setFilteredQuotations] = useState([])
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000"

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${url}/quotation`)
        setQuotations(response.data)
        setFilteredQuotations(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching quotations:", error)
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredQuotations(quotations)
    } else {
      const filtered = quotations.filter(
        (quotation) =>
          quotation.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quotation.title && quotation.title.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredQuotations(filtered)
    }
  }, [searchTerm, quotations])

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1>Quotations & Invoices</h1>
        <div className="search-filter">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="invoices-stats">
        <div className="stat-card">
          <div className="stat-card-content">
            <h3 className="stat-card-title">Total Quotations</h3>
            <p className="stat-card-value">{quotations.length}</p>
          </div>
        </div>
      </div>

      <div className="quotations-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading quotations...</p>
          </div>
        ) : filteredQuotations.length > 0 ? (
          <div className="quotations-grid">
            {filteredQuotations.map((quotation, index) => (
              <div key={index} className="quotation-card">
                <div className="quotation-icon">
                  <FileText size={24} />
                </div>
                <div className="quotation-details">
                  <h3 className="quotation-title">{quotation.title || "Untitled Quotation"}</h3>
                  <p className="quotation-filename">{quotation.fileName}</p>
                  <p className="quotation-date">Uploaded on {new Date(quotation.uploadDate).toLocaleDateString()}</p>
                </div>
                <div className="quotation-actions">
                  <a
                    href={`http://localhost:3000/${quotation.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-quotations">
            <FileText size={48} />
            <p>No quotations found.</p>
            {searchTerm && <p>Try adjusting your search criteria.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

