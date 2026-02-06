const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { z } = require('zod');

const prisma = new PrismaClient();

const coordinatorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    department: z.string().min(1, "Department is required"),
});

const createCoordinator = async (req, res) => {
    try {
        const data = coordinatorSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const coordinator = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                department: data.department,
                role: 'COORDINATOR',
                isEnabled: true,
            },
        });

        res.status(201).json({ message: 'Coordinator created successfully.', coordinatorId: coordinator.id });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getCoordinators = async (req, res) => {
    try {
        const coordinators = await prisma.user.findMany({
            where: { role: 'COORDINATOR' },
            select: { id: true, name: true, email: true, department: true, isEnabled: true, createdAt: true },
        });
        res.json(coordinators);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const toggleCoordinatorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isEnabled } = req.body; // Expect boolean

        const coordinator = await prisma.user.update({
            where: { id },
            data: { isEnabled },
        });

        res.json({ message: `Coordinator ${coordinator.isEnabled ? 'enabled' : 'disabled'} successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalFeedbacks = await prisma.feedback.count();
        const approvedFeedbacks = await prisma.feedback.count({ where: { status: 'APPROVED' } });
        const pendingFeedbacks = await prisma.feedback.count({ where: { status: 'PENDING' } });
        const rejectedFeedbacks = await prisma.feedback.count({ where: { status: 'REJECTED' } });
        const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
        const totalCoordinators = await prisma.user.count({ where: { role: 'COORDINATOR' } });

        res.json({
            totalFeedbacks,
            approvedFeedbacks,
            pendingFeedbacks,
            rejectedFeedbacks,
            totalStudents,
            totalCoordinators,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { createCoordinator, getCoordinators, toggleCoordinatorStatus, getDashboardStats };
