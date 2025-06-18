const { Category, Task } = require('../models/associations');
const catchAsync = require('../utils/catchAsync');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const withTasks = req.query.withTasks === 'true';
  const include = withTasks ? [{ model: Task, as: 'categoryTasks' }] : [];
  const categories = await Category.findAll({ include });
  res.json(categories);
});

exports.getCategoryById = catchAsync(async (req, res, next) => {
  const withTasks = req.query.withTasks === 'true';
  const include = withTasks ? [{ model: Task, as: 'categoryTasks' }] : [];
  const category = await Category.findByPk(req.params.id, { include });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

exports.createCategory = catchAsync(async (req, res, next) => {
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
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, taskIds } = req.body;
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  await category.update({ name });
  if (taskIds && Array.isArray(taskIds)) {
    await category.setCategoryTasks(taskIds);
  }
  const updatedCategory = await Category.findByPk(category.id, { include: [{ model: Task, as: 'categoryTasks' }] });
  res.json(updatedCategory);
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const deleted = await Category.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.json({ message: 'Category deleted' });
});
