const express = require('express');
const { createCoordinator, getCoordinators, toggleCoordinatorStatus, getDashboardStats } = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

// protect all admin routes
router.use(authenticateToken, authorizeRoles('ADMIN'));

router.post('/coordinators', createCoordinator);
router.get('/coordinators', getCoordinators);
router.patch('/coordinators/:id', toggleCoordinatorStatus);
router.get('/stats', getDashboardStats);

module.exports = router;
