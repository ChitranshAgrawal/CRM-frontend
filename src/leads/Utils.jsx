// Utils.js
export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const filterableColumns = [
    "source",
    "salesRep",
    "priority",
    "mode",
];


export const isLeadNewByClick = (leadID) => {
    const clickedLeads = JSON.parse(localStorage.getItem("clickedLeads") || "[]");
    return !clickedLeads.includes(leadID);
};

