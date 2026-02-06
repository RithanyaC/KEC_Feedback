const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const feedbackSchema = z.object({
    companyName: z.string().min(1),
    driveId: z.string().optional(),
    jobRole: z.string().min(1),
    package: z.string().optional(),
    overallDifficulty: z.string(),
    tips: z.string().optional(),
    suggestions: z.string().optional(),
    rounds: z.array(z.object({
        roundNumber: z.number(),
        roundType: z.string().min(1),
        duration: z.string().optional(),
        difficulty: z.string(),
        questions: z.string().optional(),
        experience: z.string().optional()
    })).min(1)
});

const submitFeedback = async (req, res) => {
    try {
        const data = feedbackSchema.parse(req.body);
        const userId = req.user.id;

        let department = req.user.department;
        if (!department) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            department = user.department;
        }

        const feedback = await prisma.feedback.create({
            data: {
                studentId: userId,
                driveId: data.driveId,
                companyName: data.companyName,
                department: department,
                jobRole: data.jobRole,
                package: data.package,
                overallDifficulty: data.overallDifficulty,
                tips: data.tips,
                suggestions: data.suggestions,
                status: 'PENDING',
                rounds: {
                    create: data.rounds
                }
            },
            include: { rounds: true }
        });

        res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error("Submit Feedback Error:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getFeedbacks = async (req, res) => { // Public/Approved
    try {
        const { department, company } = req.query;
        const where = { status: 'APPROVED' };
        if (department) where.department = department;
        if (company) where.companyName = { contains: company }; // SQLite doesn't support insensitive directly easily without raw, but simple contains works for now.

        const feedbacks = await prisma.feedback.findMany({
            where,
            include: { student: { select: { name: true, department: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getAllFeedbacksAdmin = async (req, res) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: { student: { select: { name: true, department: true, rollNumber: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
};

const getPendingFeedbacksByDept = async (req, res) => { // Coordinator
    try {
        const { department } = req.user;
        if (!department) return res.status(400).json({ message: 'Coordinator department not found.' });

        const feedbacks = await prisma.feedback.findMany({
            where: { department, status: 'PENDING' },
            include: { student: { select: { name: true, rollNumber: true } } },
        });
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const updateFeedbackStatus = async (req, res) => { // Approve/Reject
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const feedback = await prisma.feedback.update({
            where: { id },
            data: { status, remarks },
        });

        res.json({ message: `Feedback ${status.toLowerCase()} successfully.`, feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { submitFeedback, getFeedbacks, getAllFeedbacksAdmin, getPendingFeedbacksByDept, updateFeedbackStatus };
