import type { User as UserModel } from "@prisma/client"

export type SafeUser = {
  id: string
  email: string
  name: string | null
  role: "BUYER" | "SELLER" | string
  createdAt: Date
}

export function mapUser(user: UserModel): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  }
}
