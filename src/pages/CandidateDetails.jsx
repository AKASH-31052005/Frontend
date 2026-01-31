import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { candidateService } from '../services/candidateService';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const CandidateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const basePath = user?.role === 'HR' ? '/hr' : '/recruiter';

    useEffect(() => {
        fetchCandidate();
    }, [id]);

    const fetchCandidate = async () => {
        setLoading(true);
        try {
            const response = await candidateService.getCandidate(id);
            setCandidate(response.data);
        } catch (error) {
            toast.error('Failed to fetch candidate details');
            navigate(`${basePath}/dashboard`);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            await candidateService.updateStatus(id, newStatus, `Status changed to ${newStatus} by ${user.name}`);
            toast.success(`Candidate ${newStatus.toLowerCase()} successfully!`);
            fetchCandidate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="details-page">
                <div className="loading" style={{ minHeight: '100vh' }}>
                    <div className="spinner"></div>
                    <p className="loading-text">Loading candidate details...</p>
                </div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="details-page">
                <div className="empty-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="empty-state-icon">❌</div>
                    <h3>Candidate Not Found</h3>
                    <p>The candidate you're looking for doesn't exist.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`${basePath}/dashboard`)}
                        style={{ marginTop: '1rem' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="details-page">
            <div className="details-header">
                <div className="details-header-content">
                    <button className="btn-back" onClick={() => navigate(`${basePath}/dashboard`)}>
                        ← Back to Dashboard
                    </button>
                    <h1 style={{ marginLeft: 'auto', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
                        Candidate Details
                    </h1>
                </div>
            </div>

            <div className="details-content">
                <div className="details-card">
                    {/* Hero Section */}
                    <div className="details-hero">
                        <div className="details-avatar">
                            {getInitials(candidate.name)}
                        </div>
                        <h1>{candidate.name}</h1>
                        <p>{candidate.position}</p>
                        <div style={{ marginTop: '1rem' }}>
                            <StatusBadge status={candidate.status} />
                        </div>
                    </div>

                    {/* Details Body */}
                    <div className="details-body">
                        {/* Contact Information */}
                        <div className="details-section">
                            <h2>Contact Information</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-label">Email</div>
                                    <div className="detail-value">{candidate.email}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Phone</div>
                                    <div className="detail-value">{candidate.phone}</div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="details-section">
                            <h2>Professional Details</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-label">Position</div>
                                    <div className="detail-value">{candidate.position}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Experience</div>
                                    <div className="detail-value">{candidate.experience} years</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Applied On</div>
                                    <div className="detail-value">{formatDate(candidate.appliedAt)}</div>
                                </div>
                                {candidate.resumeUrl && (
                                    <div className="detail-item">
                                        <div className="detail-label">Resume</div>
                                        <div className="detail-value">
                                            <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                View Resume →
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="details-section">
                            <h2>Skills</h2>
                            <div className="skills-list" style={{ gap: '0.5rem' }}>
                                {candidate.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag" style={{ fontSize: '0.85rem', padding: '0.375rem 0.875rem' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Status History */}
                        <div className="details-section">
                            <h2>Status History</h2>
                            <div className="status-history">
                                <div className="timeline">
                                    {candidate.statusHistory.map((history, index) => (
                                        <div key={index} className="timeline-item">
                                            <div className={`timeline-dot ${history.status.toLowerCase()}`}></div>
                                            <div className="timeline-content">
                                                <div className="timeline-status">{history.status}</div>
                                                <div className="timeline-meta">
                                                    {formatDate(history.changedAt)}
                                                    {history.changedBy && (
                                                        <span> by {history.changedBy.name || 'System'}</span>
                                                    )}
                                                </div>
                                                {history.notes && (
                                                    <div className="timeline-notes">"{history.notes}"</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (Recruiter Only) */}
                        {user?.role === 'RECRUITER' && candidate.status === 'APPLIED' && (
                            <div className="details-actions">
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleStatusUpdate('SHORTLISTED')}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : '✓ Shortlist Candidate'}
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleStatusUpdate('REJECTED')}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : '✕ Reject Candidate'}
                                </button>
                            </div>
                        )}

                        {/* Final Status Message */}
                        {candidate.status !== 'APPLIED' && (
                            <div style={{
                                padding: '1rem 1.5rem',
                                background: candidate.status === 'SHORTLISTED'
                                    ? 'var(--color-success-light)'
                                    : 'var(--color-danger-light)',
                                borderRadius: 'var(--radius-md)',
                                marginTop: '1.5rem',
                                textAlign: 'center',
                                color: candidate.status === 'SHORTLISTED'
                                    ? 'var(--color-success)'
                                    : 'var(--color-danger)'
                            }}>
                                <strong>
                                    {candidate.status === 'SHORTLISTED'
                                        ? '✅ This candidate has been shortlisted'
                                        : '❌ This candidate has been rejected'}
                                </strong>
                                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                                    Status cannot be changed further as per the workflow rules.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetails;
