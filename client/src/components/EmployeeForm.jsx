import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        dateOfJoining: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="flex justify-between mb-4">
                    <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <button className="secondary" onClick={onCancel} style={{ padding: '0.5rem' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Position</label>
                            <input
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Joining</label>
                            <input
                                type="date"
                                name="dateOfJoining"
                                value={formData.dateOfJoining}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="primary">
                            {employee ? 'Update Employee' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;
