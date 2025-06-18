const { Category, Task } = require('../models/associations');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ include: [{ model: Task, as: 'categoryTasks' }] });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [{ model: Task, as: 'categoryTasks' }] });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    let { name, taskIds, tasks } = req.body;
    if (!taskIds && Array.isArray(tasks)) {
      taskIds = tasks;
    }
    const newCategory = await Category.create({ name });
    if (taskIds && Array.isArray(taskIds)) {
      await newCategory.setCategoryTasks(taskIds);
    }
    const categoryWithTasks = await Category.findByPk(newCategory.id, { include: [{ model: Task, as: 'categoryTasks' }] });
    res.status(201).json(categoryWithTasks);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, taskIds } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await category.update({ name });
    if (taskIds && Array.isArray(taskIds)) {
      await category.setCategoryTasks(taskIds);
    }
    const updatedCategory = await Category.findByPk(category.id, { include: [{ model: Task, as: 'categoryTasks' }] });
    res.json(updatedCategory);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
