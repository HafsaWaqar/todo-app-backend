const { User } = require('../models/associations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const withTasks = req.query.withTasks === 'true';
  const users = withTasks
    ? await User.scope('withTasks').findAll()
    : await User.findAll();
  res.json(users);
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const withTasks = req.query.withTasks === 'true';
  const user = withTasks
    ? await User.scope('withTasks').findByPk(req.params.id)
    : await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, password: hashedPassword, role });
  res.status(201).json(newUser);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  const user = await User.unscoped().findOne({ where: { name } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin users can obtain a token' });
  }
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

exports.createUser = exports.registerUser; // Alias for backward compatibility

exports.updateUser = catchAsync(async (req, res, next) => {
  const [updated] = await User.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const updatedUser = await User.findByPk(req.params.id);
  res.json(updatedUser);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
});
