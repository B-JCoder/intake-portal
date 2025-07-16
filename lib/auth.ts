import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required")
  }

  return user
}
