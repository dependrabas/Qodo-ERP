import React from 'react';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
    if (!employees.length) {
        return (
            <div className="card empty-state">
                <h3>No employees found</h3>
                <p>Get started by adding a new employee to the system.</p>
            </div>
        );
    }

    return (
        <div className="card table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>
                                <div style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</div>
                            </td>
                            <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                            <td><span className="badge">{emp.position}</span></td>
                            <td>{emp.department}</td>
                            <td>${Number(emp.salary).toLocaleString()}</td>
                            <td>{new Date(emp.dateOfJoining).toLocaleDateString()}</td>
                            <td>
                                <div className="flex" style={{ gap: '0.5rem' }}>
                                    <button
                                        className="secondary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                        onClick={() => onEdit(emp)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="danger"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                        onClick={() => onDelete(emp.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;
