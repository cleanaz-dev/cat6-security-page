import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export async function getAllClerkUsers() {
  try {
    const users = await clerk.users.getUserList()
    return users.data
  } catch (error) {
    
  }
}