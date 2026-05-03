import { useState } from 'react';
import { candidateService } from '../services/candidateService';
import toast from 'react-hot-toast';

const AddCandidateModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        skills: '',
        resumeUrl: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedUrl = formData.resumeUrl;

            // Upload file first if selected
            if (resumeFile) {
                const uploadRes = await candidateService.uploadResume(resumeFile);
                uploadedUrl = uploadRes.url;
            }

            await candidateService.createCandidate({
                ...formData,
                resumeUrl: uploadedUrl,
                experience: Number(formData.experience),
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            });

            toast.success('Candidate added successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                position: '',
                experience: '',
                skills: '',
                resumeUrl: ''
            });
            setResumeFile(null);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add candidate');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Candidate</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter candidate's full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Position *</label>
                            <input
                                type="text"
                                name="position"
                                className="form-input"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="e.g., Frontend Developer"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Experience (years) *</label>
                            <input
                                type="number"
                                name="experience"
                                className="form-input"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Years of experience"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Skills * (comma-separated)</label>
                            <input
                                type="text"
                                name="skills"
                                className="form-input"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g., React, Node.js, MongoDB"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Resume (PDF/Word, Optional)</label>
                            <input
                                type="file"
                                name="resumeFile"
                                className="form-input"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Candidate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCandidateModal;
