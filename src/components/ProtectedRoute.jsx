import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardPath = user.role === 'HR' ? '/hr/dashboard' : '/recruiter/dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
