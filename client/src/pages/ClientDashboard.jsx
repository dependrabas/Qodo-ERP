import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search } from 'lucide-react';

const ClientDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter(emp =>
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [searchTerm, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <div className="header flex justify-between">
                <div>
                    <h1>Employee Directory</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Welcome, {username}
                    </p>
                </div>
                <button className="secondary" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Search Bar */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search by name, department, or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
            </div>

            {/* Employee Grid */}
            {filteredEmployees.length === 0 ? (
                <div className="card empty-state">
                    <h3>No employees found</h3>
                    <p>Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid">
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="card">
                            <div style={{ marginBottom: '1rem' }}>
                                <h3>{emp.firstName} {emp.lastName}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {emp.email}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Position:</span>
                                    <span className="badge">{emp.position}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department:</span>
                                    <span>{emp.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Joined:</span>
                                    <span>{new Date(emp.dateOfJoining).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
