const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const Employee = require('./models/Employee');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = 'your_secret_key_here'; // In prod, use env var

app.use(cors());
app.use(bodyParser.json());

// Sync Database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Failed to sync database:', err);
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, role: user.role, username: user.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analytics Route
app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.findAll();

        // Department Distribution
        const departmentData = {};
        employees.forEach(emp => {
            departmentData[emp.department] = (departmentData[emp.department] || 0) + 1;
        });
        const departmentChart = Object.keys(departmentData).map(dept => ({
            name: dept,
            value: departmentData[dept]
        }));

        // Salary Trends (Simplified: Avg salary per department)
        const salaryData = {};
        const deptCounts = {};
        employees.forEach(emp => {
            salaryData[emp.department] = (salaryData[emp.department] || 0) + emp.salary;
            deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
        });
        const salaryChart = Object.keys(salaryData).map(dept => ({
            name: dept,
            salary: Math.round(salaryData[dept] / deptCounts[dept])
        }));

        res.json({ departmentChart, salaryChart, totalEmployees: employees.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Employee Routes (Protected)
app.get('/api/employees', authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/employees', authenticateToken, async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/employees/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Employee.update(req.body, {
            where: { id }
        });
        if (updated) {
            const updatedEmployee = await Employee.findByPk(id);
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/employees/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
