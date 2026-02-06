const express = require('express');
const { registerStudent, login, getMe } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

module.exports = router;
