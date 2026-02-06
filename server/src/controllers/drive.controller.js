const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const z = require('zod');

// Schema for creating a drive
const createDriveSchema = z.object({
    companyName: z.string().min(1),
    date: z.string().or(z.date()), // Accept string date from frontend
    department: z.string().min(1),
    description: z.string().optional()
});

exports.createDrive = async (req, res) => {
    try {
        const data = createDriveSchema.parse(req.body);

        // Parse date if string
        const date = new Date(data.date);

        const drive = await prisma.placementDrive.create({
            data: {
                companyName: data.companyName,
                date: date,
                department: data.department,
                description: data.description
            }
        });

        res.status(201).json(drive);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.errors?.[0]?.message || 'Failed to create drive' });
    }
};

exports.getDrivesByDepartment = async (req, res) => {
    try {
        const { department } = req.user;
        console.log(`[DEBUG] Fetching Drives for Dept: '${department}'`);

        const drives = await prisma.placementDrive.findMany({
            where: {
                department: department
            },
            include: {
                _count: {
                    select: { eligibleStudents: true }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.json(drives);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch drives' });
    }
};

// Fetch all students in a department to let coordinator select them
exports.getStudentsByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const { driveId } = req.query; // Optional: if provided, check eligibility

        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                department: department
            },
            select: {
                id: true,
                name: true,
                email: true,
                rollNumber: true
            }
        });

        if (driveId) {
            const eligibility = await prisma.driveEligibility.findMany({
                where: {
                    driveId: driveId,
                    studentId: { in: students.map(s => s.id) },
                    isEligible: true
                },
                select: { studentId: true }
            });

            const eligibleIds = new Set(eligibility.map(e => e.studentId));

            // Return existing structure but useful for frontend to know
            // Alternatively, return list of eligible IDs in a separate field? 
            // Let's modify the response to include isEligible flag or return separate list.
            // Client expects array of students. Let's add isEligible field.

            const studentsWithStatus = students.map(s => ({
                ...s,
                isEligible: eligibleIds.has(s.id)
            }));

            return res.json(studentsWithStatus);
        }

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
};

exports.addEligibleStudents = async (req, res) => {
    try {
        const { driveId } = req.params;
        const { studentIds } = req.body;

        console.log(`Updating eligibility for drive ${driveId}, Students Count: ${studentIds?.length}`);

        if (!Array.isArray(studentIds)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        // Transaction: 
        // 1. Remove all eligibility for this drive (reset)
        // 2. Add the selected students
        await prisma.$transaction(async (tx) => {
            // Delete existing
            await tx.driveEligibility.deleteMany({
                where: { driveId: driveId }
            });

            // Create new
            if (studentIds.length > 0) {
                await tx.driveEligibility.createMany({
                    data: studentIds.map(id => ({
                        studentId: id,
                        driveId: driveId,
                        isEligible: true
                    }))
                });
            }
        });

        res.json({ message: `Success! Updated student eligibility.` });
    } catch (error) {
        console.error("Error adding students:", error);
        res.status(500).json({ message: 'Failed to add students' });
    }
};

exports.getMyEligibleDrives = async (req, res) => {
    try {
        const studentId = req.user.id;
        console.log(`Fetching eligible drives for student: ${studentId}`);

        const drives = await prisma.placementDrive.findMany({
            where: {
                eligibleStudents: {
                    some: {
                        studentId: studentId,
                        isEligible: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        console.log(`Found ${drives.length} drives for student ${studentId}`);

        res.json(drives);
    } catch (error) {
        console.error("Error fetching my drives:", error);
        res.status(500).json({ message: 'Failed to fetch your drives' });
    }
};
