import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token: newToken, user: userData } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);

        return userData;
    };

    const register = async (name, email, password, role = 'RECRUITER') => {
        const response = await api.post('/auth/register', { name, email, password, role });
        const { token: newToken, user: userData } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);

        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
