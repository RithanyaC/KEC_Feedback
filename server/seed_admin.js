const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Admin User...");

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@college.edu' },
        update: {},
        create: {
            email: 'admin@college.edu',
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN',
            isEnabled: true
        }
    });

    console.log(`Admin created: ${admin.email} (Password: admin123)`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
