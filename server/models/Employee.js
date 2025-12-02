const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Employee = sequelize.define('Employee', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dateOfJoining: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

module.exports = Employee;
