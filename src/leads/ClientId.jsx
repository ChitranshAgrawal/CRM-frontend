import axios from 'axios';

const url = import.meta.env.VITE_API_URL || "http://localhost:8000";

// This function fetches current max lead ID and returns the next one
export const generateNextLeadID = async () => {
    try {
        const response = await axios.get(`${url}/leads`);
        const ids = response.data.map(lead => {
            if (lead.leadID && lead.leadID.startsWith('CLZ')) {
                return parseInt(lead.leadID.replace('CLZ', ''), 10);
            }
            return 0;
        });
        const maxId = Math.max(...ids, 0);
        const nextId = maxId + 1;
        return `CLZ${nextId.toString().padStart(4, '0')}`;
    } catch (err) {
        console.error("Error generating Lead ID:", err);
        return null;
    }
};
