// Session utils — uses centralized axiosInstance
import toast from "react-hot-toast";
import {decryptComplaint} from "../context/DecryptionHelper.js";
import API from "../api/axiosInstance.js";

export const fetchActiveComplaints = async () => {
    try {
        const response = await API.get('/complaint/fetch');
        const data = response.data;
        let complaintsArray = [];
        if (Array.isArray(data)) {
            complaintsArray = data;
        } else if (Array.isArray(data.complaints)) {
            complaintsArray = data.complaints;
        } else if (data && typeof data === 'object' && data.id) {
            // Single complaint object
            complaintsArray = [data];
        } else {
            complaintsArray = [];
        }
        toast.success("Complaints loaded");
        const decryptedComplaints = complaintsArray.map(decryptComplaint);
        sessionStorage.setItem('complaints', JSON.stringify(decryptedComplaints));
        return true;
    } catch (error) {
        console.error('Error fetching active complaints:', error);
        toast.error('Failed to load complaints');
        return false;
    }
};
