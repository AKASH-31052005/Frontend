import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="dashboard-header">
            <div className="dashboard-header-content">
                <div className="dashboard-logo">
                    <div className="dashboard-logo-icon">👥</div>
                    <h1>CandidateHub</h1>
                </div>

                <div className="dashboard-user">
                    <div className="user-info">
                        <div className="user-name">{user?.name}</div>
                        <div className="user-role">{user?.role}</div>
                    </div>
                    <div className="user-avatar">{user ? getInitials(user.name) : 'U'}</div>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
