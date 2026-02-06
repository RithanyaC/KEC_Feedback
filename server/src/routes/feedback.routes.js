const express = require('express');
const {
    submitFeedback,
    getFeedbacks,
    getAllFeedbacksAdmin,
    getPendingFeedbacksByDept,
    updateFeedbackStatus
} = require('../controllers/feedback.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

// Public (Approved Feedbacks) - technically authenticated users (students/all)
router.get('/public', authenticateToken, getFeedbacks);

// Student
router.post('/submit', authenticateToken, authorizeRoles('STUDENT'), submitFeedback);

// Admin
router.get('/admin/all', authenticateToken, authorizeRoles('ADMIN'), getAllFeedbacksAdmin);

// Coordinator
router.get('/coordinator/pending', authenticateToken, authorizeRoles('COORDINATOR'), getPendingFeedbacksByDept);

// Shared Admin/Coordinator Actions
// Note: In a real app, we might strictly check department match for coordinator here too.
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'COORDINATOR'), updateFeedbackStatus);

module.exports = router;
