import api from './api';

export const candidateService = {
    // Get all candidates with optional filters
    getCandidates: async (params = {}) => {
        const response = await api.get('/candidates', { params });
        return response.data;
    },

    // Get single candidate by ID
    getCandidate: async (id) => {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    },

    // Create new candidate
    createCandidate: async (candidateData) => {
        const response = await api.post('/candidates', candidateData);
        return response.data;
    },

    // Update candidate details
    updateCandidate: async (id, candidateData) => {
        const response = await api.put(`/candidates/${id}`, candidateData);
        return response.data;
    },

    // Update candidate status (SHORTLISTED or REJECTED)
    updateStatus: async (id, status, notes = '') => {
        const response = await api.put(`/candidates/${id}/status`, { status, notes });
        return response.data;
    },

    // Delete candidate
    deleteCandidate: async (id) => {
        const response = await api.delete(`/candidates/${id}`);
        return response.data;
    },

    // Get candidate statistics
    getStats: async () => {
        const response = await api.get('/candidates/stats');
        return response.data;
    },

    // Upload resume file
    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        const response = await api.post('/upload/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
