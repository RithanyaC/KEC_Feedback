const express = require('express');
const router = express.Router();
const driveController = require('../controllers/drive.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// Coordinator Routes
router.post('/create', authenticateToken, authorizeRoles('COORDINATOR', 'ADMIN'), driveController.createDrive);
router.get('/department', authenticateToken, authorizeRoles('COORDINATOR', 'ADMIN'), driveController.getDrivesByDepartment);
router.get('/students/:department', authenticateToken, authorizeRoles('COORDINATOR', 'ADMIN'), driveController.getStudentsByDepartment);
router.post('/:driveId/add-students', authenticateToken, authorizeRoles('COORDINATOR', 'ADMIN'), driveController.addEligibleStudents);

// Student Routes
router.get('/my-drives', authenticateToken, authorizeRoles('STUDENT'), driveController.getMyEligibleDrives);

module.exports = router;
