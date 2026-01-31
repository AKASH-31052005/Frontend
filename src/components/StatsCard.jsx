const StatsCard = ({ icon, label, value, type }) => {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <div className={`stat-icon ${type}`}>{icon}</div>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

export default StatsCard;
