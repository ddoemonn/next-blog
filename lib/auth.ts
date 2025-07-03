import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface User {
  username: string
  isAdmin: boolean
}

export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    throw new Error('Admin credentials not configured')
  }

  return username === adminUsername && password === adminPassword
}

export function generateToken(user: User): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }

  return jwt.sign(user, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): User | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new Error('JWT secret not configured')
    }

    const decoded = jwt.verify(token, secret) as User
    return decoded
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')
    
    if (!token?.value) {
      return null
    }

    return verifyToken(token.value)
  } catch {
    return null
  }
}

export function setAuthCookie(token: string) {
  return {
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
} 