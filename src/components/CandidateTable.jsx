import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';

const CandidateTable = ({
    candidates,
    onShortlist,
    onReject,
    loading,
    showActions = true
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const basePath = user?.role === 'HR' ? '/hr' : '/recruiter';

    if (loading) {
        return (
            <div className="table-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading candidates...</p>
                </div>
            </div>
        );
    }

    if (!candidates || candidates.length === 0) {
        return (
            <div className="table-container">
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No Candidates Found</h3>
                    <p>There are no candidates matching your criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Candidate</th>
                        <th>Position</th>
                        <th>Experience</th>
                        <th>Skills</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate._id}>
                            <td>
                                <div className="candidate-info">
                                    <div className="candidate-avatar">
                                        {getInitials(candidate.name)}
                                    </div>
                                    <div>
                                        <div className="candidate-name">{candidate.name}</div>
                                        <div className="candidate-email">{candidate.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{candidate.position}</td>
                            <td>{candidate.experience} years</td>
                            <td>
                                <div className="skills-list">
                                    {candidate.skills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                    {candidate.skills.length > 3 && (
                                        <span className="skill-tag">+{candidate.skills.length - 3}</span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={candidate.status} />
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="btn-icon view"
                                        onClick={() => navigate(`${basePath}/candidate/${candidate._id}`)}
                                        title="View Details"
                                    >
                                        👁️
                                    </button>
                                    {showActions && user?.role === 'HR' && (
                                        <>
                                            <button
                                                className="btn-icon shortlist"
                                                onClick={() => onShortlist(candidate._id)}
                                                disabled={candidate.status !== 'APPLIED'}
                                                title="Shortlist"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="btn-icon reject"
                                                onClick={() => onReject(candidate._id)}
                                                disabled={candidate.status !== 'APPLIED'}
                                                title="Reject"
                                            >
                                                ✕
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CandidateTable;
