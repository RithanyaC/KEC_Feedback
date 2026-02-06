const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const prisma = new PrismaClient();

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").endsWith("@college.edu", "Must use college email (@college.edu)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rollNumber: z.string().min(1, "Roll number is required"),
    department: z.string().min(1, "Department is required"),
    semester: z.string().min(1, "Semester is required"),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const registerStudent = async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const student = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                rollNumber: data.rollNumber,
                department: data.department,
                semester: data.semester,
                role: 'STUDENT',
            },
        });

        res.status(201).json({ message: 'Student registered successfully.', userId: student.id });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        if (user.role === 'COORDINATOR' && !user.isEnabled) {
            return res.status(403).json({ message: 'Your account is disabled. Contact admin.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name, department: user.department },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getMe = async (req, res) => {
    // req.user is populated by authenticateToken
    // Fetch fresh data from DB to ensure validity (optional but safer)
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, department: true }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user details" });
    }
}

module.exports = { registerStudent, login, getMe };
