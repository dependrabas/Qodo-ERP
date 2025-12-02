import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'client'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            const response = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (isRegister) {
                setIsRegister(false);
                setError('Registration successful! Please login.');
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('username', data.username);
                onLogin(data.role);
                navigate(data.role === 'admin' ? '/admin' : '/client');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1>Employment Management System</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {isRegister ? 'Create your account' : 'Sign in to continue'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                        />
                    </div>

                    {isRegister && (
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                style={{
                                    backgroundColor: 'var(--background-dark)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    width: '100%',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: error.includes('successful') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: error.includes('successful') ? 'var(--success-color)' : 'var(--danger-color)',
                            borderRadius: 'var(--radius)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isRegister ? (
                            <span className="flex" style={{ justifyContent: 'center' }}>
                                <UserPlus size={20} /> Register
                            </span>
                        ) : (
                            <span className="flex" style={{ justifyContent: 'center' }}>
                                <LogIn size={20} /> Login
                            </span>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        className="secondary"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)' }}
                    >
                        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
