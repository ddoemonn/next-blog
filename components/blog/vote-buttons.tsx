'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import type { PostVotes } from '@/lib/votes'

interface VoteButtonsProps {
  postSlug: string
  initialVotes: PostVotes
}

export function VoteButtons({ postSlug, initialVotes }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (isVoting) return

    setIsVoting(true)
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, type: 'up' })
      })

      const data = await response.json()
      if (response.ok) {
        setVotes(data.votes)
      }
    } catch (error) {
      console.error('Vote failed:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleVote}
      disabled={isVoting}
      className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
    >
      <Heart className="h-4 w-4" />
      <span className="text-sm">{votes.upvotes}</span>
    </Button>
  )
} 