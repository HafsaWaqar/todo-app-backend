const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/auth');

router.get('/', authenticateJWT, userController.getAllUsers);
router.get('/:id', authenticateJWT, userController.getUserById);
router.post('/register', userController.registerUser); // Register endpoint
router.post('/login', userController.loginUser); // Login endpoint
router.put('/:id', authenticateJWT, userController.updateUser);
router.delete('/:id', authenticateJWT, userController.deleteUser);

module.exports = router;
