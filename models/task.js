const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Task = sequelize.define('Task', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'in-progress'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'tasks'
});

// Associations are now handled in models/associations.js only

module.exports = Task;
