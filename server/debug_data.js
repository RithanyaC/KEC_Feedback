const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("=== USERS ===");
    const users = await prisma.user.findMany();
    console.table(users.map(u => ({ id: u.id, name: u.name, role: u.role, dept: u.department, email: u.email })));

    console.log("\n=== PLACEMENT DRIVES ===");
    const drives = await prisma.placementDrive.findMany();
    console.table(drives);

    console.log("\n=== FEEDBACKS ===");
    const feedbacks = await prisma.feedback.findMany({
        include: { rounds: true }
    });
    console.table(feedbacks.map(f => ({
        id: f.id,
        company: f.companyName,
        dept: f.department,
        status: f.status,
        rounds: f.rounds.length
    })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
