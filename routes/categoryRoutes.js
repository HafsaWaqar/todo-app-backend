const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, categoryController.getAllCategories);
router.get('/:id', authenticateJWT, categoryController.getCategoryById);
router.post('/', authenticateJWT, categoryController.createCategory);
router.put('/:id', authenticateJWT, categoryController.updateCategory);
router.delete('/:id', authenticateJWT, categoryController.deleteCategory);

module.exports = router;
