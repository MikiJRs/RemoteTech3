import { create } from 'zustand';
import axios from 'axios';

// Backend API URL'sini tanımla
const apiUrl = import.meta.env.VITE_BE_URL;

const useQuestionPackageStore = create((set, get) => ({
    questionPackages: [],
    isAuthenticated: false,

    fetchPackages: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/question-packages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set({ questionPackages: response.data });
        } catch (error) {
            console.error('Veri çekilirken bir hata oluştu:', error);
        }
    },

    addPackage: async (newPackage) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/question-package`, newPackage, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set((state) => ({
                questionPackages: [...state.questionPackages, response.data],
            }));
        } catch (error) {
            console.error('Yeni paket eklenirken bir hata oluştu:', error);
        }
    },

    updatePackage: async (id, updatedPackage) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            return;
        }

        try {
            const response = await axios.put(`${apiUrl}/question-package/${id}`, updatedPackage, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set((state) => ({
                questionPackages: state.questionPackages.map((pkg) =>
                    pkg._id === id ? response.data : pkg
                ),
            }));
        } catch (error) {
            console.error('Paket güncellenirken bir hata oluştu:', error);
        }
    },

    deletePackage: async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            return;
        }

        try {
            await axios.delete(`${apiUrl}/question-package/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set((state) => ({
                questionPackages: state.questionPackages.filter((pkg) => pkg._id !== id),
            }));
        } catch (error) {
            console.error('Paket silinirken bir hata oluştu:', error);
        }
    },

    // Kullanıcının kimliğini kontrol etme
    setAuthentication: (auth) => set({ isAuthenticated: auth }),
}));

export default useQuestionPackageStore;
