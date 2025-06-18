const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Task = require('./task');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withTasks: {
      include: [{ model: Task, as: 'tasks' }]
    }
  }
});

module.exports = User;
