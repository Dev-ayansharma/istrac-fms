import {prisma} from "../src/config/db.js"
import bcrypt from "bcrypt"
async function main() {
  console.log('Seeding...')
 
  // ---Super Admin ---
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12)
 
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@istrac.local' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@istrac.local',
      employeeId: 'EMP-0001',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      tempPass: false,
    },
  })
 
  // --- 2 Departments ---
  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: {
      name: 'Engineering',
      hddPath: '/mnt/istrac-data/engineering',
    },
  })
 
  const hr = await prisma.department.upsert({
    where: { name: 'HR' },
    update: {},
    create: {
      name: 'HR',
      hddPath: '/mnt/istrac-data/hr',
    },
  })
 
  // Give the super admin explicit access to both, matching real app behaviour
  await prisma.userDepartmentAccess.upsert({
    where: { userId_departmentId: { userId: superAdmin.id, departmentId: engineering.id } },
    update: {},
    create: { userId: superAdmin.id, departmentId: engineering.id, accessLevel: 'READ_WRITE_DELETE' },
  })
  await prisma.userDepartmentAccess.upsert({
    where: { userId_departmentId: { userId: superAdmin.id, departmentId: hr.id } },
    update: {},
    create: { userId: superAdmin.id, departmentId: hr.id, accessLevel: 'READ_WRITE_DELETE' },
  })
 
  // --- Sample files (metadata only — matches "files stay on HDD" architecture) ---
  await prisma.file.upsert({
    where: { hddPath: '/mnt/istrac-data/engineering/design-doc.pdf' },
    update: {},
    create: {
      departmentId: engineering.id,
      nodeType: 'FILE',
      name: 'design-doc.pdf',
      hddPath: '/mnt/istrac-data/engineering/design-doc.pdf',
      sizeBytes: 204800,
      mimeType: 'application/pdf',
      extension: 'pdf',
      uploaderId: superAdmin.id,
      status: 'ACTIVE',
    },
  })
 
  await prisma.file.upsert({
    where: { hddPath: '/mnt/istrac-data/hr/onboarding-checklist.docx' },
    update: {},
    create: {
      departmentId: hr.id,
      nodeType: 'FILE',
      name: 'onboarding-checklist.docx',
      hddPath: '/mnt/istrac-data/hr/onboarding-checklist.docx',
      sizeBytes: 51200,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: 'docx',
      uploaderId: superAdmin.id,
      status: 'ACTIVE',
    },
  })
 
  console.log('Seed completed:', {
    superAdmin: superAdmin.email,
    departments: [engineering.name, hr.name],
  })
}
 
main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
 