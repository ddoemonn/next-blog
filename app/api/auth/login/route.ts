import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, generateToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    if (verifyCredentials(username, password)) {
      const user = { username, isAdmin: true }
      const token = generateToken(user)
      const cookieConfig = setAuthCookie(token)

      const response = NextResponse.json({ success: true })
      response.cookies.set(cookieConfig)
      
      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 