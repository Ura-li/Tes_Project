const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcry
  pt.hash('admin123', 10); // hash the password

  await prisma.user.upsert({
    where: { Email: 'admin@admin.com' },
    update: {},
    create: {
      Email: 'admin@admin.com',
      Username: 'admin',
      Password: hashedPassword,
      Name: 'Admin Account',
      Role: 'admin',
      ProfilePhoto: 'https://example.com/profile.png',
    },
  });

  console.log('✅ Admin user created or already exists');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
