import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterDashboard from './pages/RecruiterDashboard';
import HRDashboard from './pages/HRDashboard';
import CandidateDetails from './pages/CandidateDetails';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes - Recruiter */}
                        <Route
                            path="/recruiter/*"
                            element={
                                <ProtectedRoute allowedRoles={['RECRUITER']}>
                                    <Routes>
                                        <Route path="dashboard" element={<RecruiterDashboard />} />
                                        <Route path="candidate/:id" element={<CandidateDetails />} />
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Routes - HR */}
                        <Route
                            path="/hr/*"
                            element={
                                <ProtectedRoute allowedRoles={['HR']}>
                                    <Routes>
                                        <Route path="dashboard" element={<HRDashboard />} />
                                        <Route path="candidate/:id" element={<CandidateDetails />} />
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1e293b',
                                color: '#f1f5f9',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#1e293b',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#1e293b',
                                },
                            },
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
