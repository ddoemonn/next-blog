import { NextRequest, NextResponse } from 'next/server'
import { voteOnPost, getVoterIdentifier } from '@/lib/votes'

export async function POST(request: NextRequest) {
  try {
    const { postSlug, type } = await request.json()

    if (!postSlug || !type || !['up', 'down'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid vote data' },
        { status: 400 }
      )
    }

    const voterIdentifier = getVoterIdentifier(request)
    const result = voteOnPost(postSlug, type, voterIdentifier)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      votes: result.votes
    })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 