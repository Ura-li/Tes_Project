const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('user123', 10); // hash the password

  await prisma.user.upsert({
    where: { Email: 'user@user.com' },
    update: {},
    create: {
      Email: 'user@user.com',
      Username: 'user',
      Password: hashedPassword,
      Name: 'User Account',
      Role: 'user',
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
