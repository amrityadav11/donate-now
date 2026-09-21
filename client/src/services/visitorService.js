import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/visitors';

// Generate or retrieve session ID
const getSessionId = () => {
    let sessionId = localStorage.getItem('daansathi_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('daansathi_session_id', sessionId);
    }
    return sessionId;
};

export const visitorService = {
    // Get total and online visitor statistics
    getStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/stats`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching visitor stats:', error);
            return {
                totalVisitors: 0,
                todayVisitors: 0,
                sevenDaysVisitors: 0,
                onlineVisitors: 0,
            };
        }
    },

    // Get online visitors count
    getOnlineVisitors: async () => {
        try {
            const response = await axios.get(`${API_URL}/online`);
            return response.data.data.onlineVisitors || 0;
        } catch (error) {
            console.error('Error fetching online visitors:', error);
            return 0;
        }
    },

    // Get total visitors count
    getTotalVisitors: async () => {
        try {
            const response = await axios.get(`${API_URL}/total`);
            return response.data.data.totalVisitors || 0;
        } catch (error) {
            console.error('Error fetching total visitors:', error);
            return 0;
        }
    },

    // Record a new visitor or update existing session
    recordVisitor: async () => {
        try {
            const sessionId = getSessionId();
            const response = await axios.post(`${API_URL}/record`, {
                sessionId,
            });
            return response.data.data;
        } catch (error) {
            console.error('Error recording visitor:', error);
            return null;
        }
    },

    // Update visitor activity (heartbeat)
    updateActivity: async () => {
        try {
            const sessionId = getSessionId();
            const response = await axios.post(`${API_URL}/activity`, {
                sessionId,
            });
            return response.data.data;
        } catch (error) {
            console.error('Error updating visitor activity:', error);
            return null;
        }
    },

    // Get session ID
    getSessionId,
};

export default visitorService;
