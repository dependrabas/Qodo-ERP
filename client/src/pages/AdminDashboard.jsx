import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { LogOut, Users, DollarSign, TrendingUp } from 'lucide-react';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, analyticsRes] = await Promise.all([
                fetch('http://localhost:5001/api/employees', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5001/api/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const empData = await empRes.json();
            const analyticsData = await analyticsRes.json();

            setEmployees(empData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleAddClick = () => {
        setCurrentEmployee(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (employee) => {
        setCurrentEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await fetch(`http://localhost:5001/api/employees/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchData();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentEmployee) {
                await fetch(`http://localhost:5001/api/employees/${currentEmployee.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch('http://localhost:5001/api/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <div className="header flex justify-between">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Welcome back, {username}
                    </p>
                </div>
                <div className="flex">
                    <button className="primary" onClick={handleAddClick}>
                        + Add Employee
                    </button>
                    <button className="secondary" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
                        <div className="card">
                            <div className="flex justify-between">
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Employees</p>
                                    <h2 style={{ marginTop: '0.5rem' }}>{analytics.totalEmployees}</h2>
                                </div>
                                <Users size={32} style={{ color: 'var(--primary-color)' }} />
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex justify-between">
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Departments</p>
                                    <h2 style={{ marginTop: '0.5rem' }}>{analytics.departmentChart.length}</h2>
                                </div>
                                <TrendingUp size={32} style={{ color: 'var(--success-color)' }} />
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex justify-between">
                                <div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Avg Salary</p>
                                    <h2 style={{ marginTop: '0.5rem' }}>
                                        ${Math.round(analytics.salaryChart.reduce((a, b) => a + b.salary, 0) / analytics.salaryChart.length).toLocaleString()}
                                    </h2>
                                </div>
                                <DollarSign size={32} style={{ color: '#f59e0b' }} />
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', marginBottom: '2rem' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Department Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.departmentChart}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {analytics.departmentChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Average Salary by Department</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.salaryChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--surface-dark)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius)'
                                        }}
                                    />
                                    <Bar dataKey="salary" fill="var(--primary-color)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {/* Employee List */}
            <EmployeeList
                employees={employees}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {isModalOpen && (
                <EmployeeForm
                    employee={currentEmployee}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
