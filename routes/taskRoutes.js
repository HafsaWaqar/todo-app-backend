const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, taskController.getAllTasks);
router.get('/:id', authenticateJWT, taskController.getTaskById);
router.post('/', authenticateJWT, taskController.createTask);
router.put('/:id', authenticateJWT, taskController.updateTask);
router.delete('/:id', authenticateJWT, taskController.deleteTask);

module.exports = router;
