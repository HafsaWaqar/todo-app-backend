const User = require('./user');
const Task = require('./task');
const Category = require('./category');

// Associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.belongsToMany(Category, { through: 'category_tasks', as: 'categories', foreignKey: 'taskId', otherKey: 'categoryId' });
Category.belongsToMany(Task, { through: 'category_tasks', as: 'categoryTasks', foreignKey: 'categoryId', otherKey: 'taskId' });

module.exports = { User, Task, Category };
