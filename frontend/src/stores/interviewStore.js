import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL;

const useInterviewStore = create((set, get) => ({
    interviewList: [],
    isAuthenticated: false,
    fetchInterviews :async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('User not authenticated');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}/interviews`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        set({ interviewList: response.data });
    } catch (error) {
        console.error('Failed to fetch interviews:', error);
    }
  },

    createInterview: async (interviewData) => {
        if (!get().isAuthenticated) {
            console.error('User not authenticated');
            return;
        }  
        try {
            const response = await axios.post(`${apiUrl}/interviews`, interviewData);
            set((state) => ({
                interviewList: [...state.interviewList, response.data]
            }));
        } catch (error) {
            console.error('Failed to create interview:', error);
        }
    },
    deleteInterview: async (id) => {
        if (!get().isAuthenticated) {
            console.error('User not authenticated');
            return;
        }
        try {
            await axios.delete(`${apiUrl}/interviews/${id}`);
            set((state) => ({
                interviewList: state.interviewList.filter((interview) => interview._id !== id),
            }));
        } catch (error) {
            console.error('Failed to delete interview:', error);
        }
    },
    updateInterview: async (id, updatedData) => {
        if (!get().isAuthenticated) {
            console.error('User not authenticated');
            return;
        }
        try {
            const response = await axios.put(`${apiUrl}/interviews/${id}`, updatedData);
            set((state) => ({
                interviewList: state.interviewList.map((interview) => interview._id === id ? response.data : interview),
            }));
        } catch (error) {
            console.error('Failed to update interview:', error);
        }
    },
    login: (token) => {
        localStorage.setItem('token', token);
        set({ isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ isAuthenticated: false });
    },
}));

export default useInterviewStore;
