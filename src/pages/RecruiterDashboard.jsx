import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '../services/candidateService';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import CandidateTable from '../components/CandidateTable';
import AddCandidateModal from '../components/AddCandidateModal';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState({ total: 0, applied: 0, shortlisted: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            const response = await candidateService.getCandidates(params);
            setCandidates(response.data);
            setTotalPages(response.pages);
        } catch (error) {
            toast.error('Failed to fetch candidates');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, statusFilter]);

    const fetchStats = async () => {
        try {
            const response = await candidateService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    useEffect(() => {
        fetchStats();
    }, []);



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    return (
        <div className="dashboard">
            <Header />

            <div className="dashboard-content">
                {/* Stats Section */}
                <div className="stats-grid">
                    <StatsCard
                        icon="📋"
                        label="Total Candidates"
                        value={stats.total}
                        type="total"
                    />
                    <StatsCard
                        icon="⏳"
                        label="Applied"
                        value={stats.applied}
                        type="applied"
                    />
                    <StatsCard
                        icon="✅"
                        label="Shortlisted"
                        value={stats.shortlisted}
                        type="shortlisted"
                    />
                    <StatsCard
                        icon="❌"
                        label="Rejected"
                        value={stats.rejected}
                        type="rejected"
                    />
                </div>

                {/* Candidates Section */}
                <div className="section-header">
                    <h2 className="section-title">Candidate Applications</h2>
                    <div className="search-filter-bar">
                        <div className="search-input">
                            <span className="icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Status</option>
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                            + Add Candidate
                        </button>
                    </div>
                </div>

                <CandidateTable
                    candidates={candidates}
                    loading={loading}
                    showActions={false}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <AddCandidateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchCandidates();
                    fetchStats();
                }}
            />
        </div>
    );
};

export default RecruiterDashboard;
