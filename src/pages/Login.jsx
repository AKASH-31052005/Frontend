import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await login(formData.email, formData.password);
            toast.success(`Welcome back, ${user.name}!`);

            // Redirect based on role
            if (user.role === 'HR') {
                navigate('/hr/dashboard');
            } else {
                navigate('/recruiter/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">👥</div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to access the candidate management system</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="form-input-icon">
                                <span className="icon">📧</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="form-input-icon">
                                <span className="icon">🔒</span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-links">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>

                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <strong style={{ color: 'var(--color-primary)' }}>Demo Credentials:</strong>
                        <div style={{ marginTop: '0.5rem' }}>
                            <div>HR: <code>hr@company.com</code> / <code>password123</code></div>
                            <div>Recruiter: <code>recruiter@company.com</code> / <code>password123</code></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
