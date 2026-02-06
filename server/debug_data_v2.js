const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("=== DB DUMP START ===");

    const users = await prisma.user.findMany();
    console.log(`Total Users: ${users.length}`);
    users.forEach(u => console.log(` - [${u.role}] ${u.name} | Dept: '${u.department}' | Email: ${u.email}`));

    const drives = await prisma.placementDrive.findMany();
    console.log(`\nTotal Drives: ${drives.length}`);
    drives.forEach(d => console.log(` - Drive: ${d.companyName} | Dept: '${d.department}'`));

    const feedbacks = await prisma.feedback.findMany();
    console.log(`\nTotal Feedbacks: ${feedbacks.length}`);
    feedbacks.forEach(f => console.log(` - Feedback: ${f.companyName} | Dept: '${f.department}' | Status: ${f.status}`));

    console.log("=== DB DUMP END ===");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
