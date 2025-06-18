const { Task, User, Category } = require('../models/associations');

exports.getAllTasks = async (req, res, next) => {
  try {
    const withCategories = req.query.withCategories === 'true';
    const include = [
      { model: User, as: 'user' },
      ...(withCategories ? [{ model: Category, as: 'categories' }] : [])
    ];
    const tasks = await Task.findAll({ include });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const withCategories = req.query.withCategories === 'true';
    const include = [
      { model: User, as: 'user' },
      ...(withCategories ? [{ model: Category, as: 'categories' }] : [])
    ];
    const task = await Task.findByPk(req.params.id, { include });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { name, status, userId, categoryIds } = req.body;
    const newTask = await Task.create({ name, status, userId });
    if (categoryIds && Array.isArray(categoryIds)) {
      await newTask.setCategories(categoryIds);
    }
    const taskWithCategories = await Task.findByPk(newTask.id, { include: [{ model: Category, as: 'categories' }] });
    res.status(201).json(taskWithCategories);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { name, status, userId, categoryIds } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.update({ name, status, userId });
    if (categoryIds && Array.isArray(categoryIds)) {
      await task.setCategories(categoryIds);
    }
    const updatedTask = await Task.findByPk(task.id, { include: [{ model: Category, as: 'categories' }] });
    res.json(updatedTask);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
