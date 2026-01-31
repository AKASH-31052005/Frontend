import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const user = await register(formData.name, formData.email, formData.password);
            toast.success(`Welcome, ${user.name}! Your account has been created.`);
            navigate('/recruiter/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
                        <h1>Create Account</h1>
                        <p>Join as a recruiter to manage candidates</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <div className="form-input-icon">
                                <span className="icon">👤</span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a password (min 6 characters)"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="form-input-icon">
                                <span className="icon">🔒</span>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-links">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>

                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--color-warning)'
                    }}>
                        <strong>Note:</strong> New registrations are created as Recruiters. HR accounts are pre-configured.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
