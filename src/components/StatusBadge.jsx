const StatusBadge = ({ status }) => {
    const statusConfig = {
        APPLIED: { label: 'Applied', className: 'applied' },
        SHORTLISTED: { label: 'Shortlisted', className: 'shortlisted' },
        REJECTED: { label: 'Rejected', className: 'rejected' }
    };

    const config = statusConfig[status] || statusConfig.APPLIED;

    return (
        <span className={`status-badge ${config.className}`}>
            <span className="status-dot"></span>
            {config.label}
        </span>
    );
};

export default StatusBadge;
