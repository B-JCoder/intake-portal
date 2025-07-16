import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      clerkId: "admin_clerk_id",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  })

  // Create sample user
  const sampleUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      clerkId: "user_clerk_id",
      firstName: "John",
      lastName: "Doe",
      role: "USER",
    },
  })

  // Create sample project
  const sampleProject = await prisma.projectForm.create({
    data: {
      userId: sampleUser.id,
      businessName: "Sample Business",
      industry: "Technology",
      websiteType: "BUSINESS",
      features: ["Responsive Design", "SEO Optimization", "Contact Forms"],
      numberOfPages: 5,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      budget: 3000,
      estimatedCost: 2500,
      status: "SUBMITTED",
    },
  })

  console.log({ adminUser, sampleUser, sampleProject })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
