// Format date for display
export const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString()
  }
  
  // Get payment stage status
  export const getPaymentStageStatus = (paymentStages) => {
    if (!paymentStages || paymentStages.length === 0) return "-"
    const received = paymentStages.filter((stage) => stage.paymentStatus === "Received").length
    return `${received}/${paymentStages.length}`
  }
  
  // Calculate total payment amount
  export const calculateTotalPaymentAmount = (paymentStages) => {
    if (!paymentStages || paymentStages.length === 0) return 0
    return paymentStages.reduce((acc, stage) => acc + (stage.paymentAmount || 0), 0)
  }
  
  // Get project status class
  export const getProjectStatusClass = (status) => {
    if (!status) return "new"
  
    status = status.toLowerCase()
    if (status === "in progress") return "interested"
    if (status === "completed") return "converted"
    if (status === "on hold") return "warning"
    if (status === "cancelled") return "not-interested"
    return "new"
  }
  
  