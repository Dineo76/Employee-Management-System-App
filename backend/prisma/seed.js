const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'thembeka@admin.com' },
    update: {},
    create: {
      email: 'thembeka@admin.com',
      name: 'Thembeka Biyela',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'Finance' },
      update: {},
      create: { name: 'Finance', 
      description: 'Managing the companys financial activities' },
    }),
    
    prisma.department.upsert({
      where: { name: 'HR' },
      update: {},
      create: { name: 'HR', 
      description: 'Human Resources' },
    }),
    prisma.department.upsert({
      where: { name: 'IT' },
      update: {},
      create: { name: 'IT', 
      description: 'Software development and engineering' },
    }),
  ]);

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { email: 'sbongile@user.com' },
      update: {},
      create: {
        firstName: 'Sbongile',
        lastName: 'Rathokwane',
        email: 'sbongile@user.com',
        employeeNo: '1640',
        position: 'Accountant',
        department: {
          connect: { id: departments[0].id }
        },
        hireDate: new Date(),
      },
    }),

    prisma.employee.upsert({
      where: { email: 'simamkele@user.com' },
      update: {},
      create: {
        firstName: 'Simamkele',
        lastName: 'Mampondo',
        email: 'simamkele@user.com',
        employeeNo: '7891',
        position: 'HR Manager',
        department: {
          connect: { id: departments[1].id }
        },
        hireDate: new Date(),
      },
    }),

    prisma.employee.upsert({
      where: { email: 'dineo@user.com' },
      update: {},
      create: {
        firstName: 'Dineo',
        lastName: 'Makofane',
        email: 'dineo@user.com',
        employeeNo: '7790',
        position: 'Front End Developer',
        department: {
          connect: { id: departments[2].id }
        },
        hireDate: new Date(),
      },
    }),

    prisma.employee.upsert({
      where: { email: 'xolelwa@user.com' },
      update: {},
      create: {
        firstName: 'Xolelwa',
        lastName: 'Cekiso',
        email: 'xolelwa@user.com',
        employeeNo: '8890',
        position: 'Back End Developer',
        department: {
          connect: { id: departments[2].id }
        },
        hireDate: new Date(),
      },
    })
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin user created with email: thembeka@admin.com and password: admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });