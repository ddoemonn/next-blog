import fs from 'fs'
import path from 'path'

const votesFile = path.join(process.cwd(), 'content/votes/post-votes.json')

export interface PostVotes {
  upvotes: number
  downvotes: number
  voters: string[] // IP addresses or session IDs
}

export interface VotesData {
  [postSlug: string]: PostVotes
}

// Ensure votes directory and file exist
function ensureVotesFile() {
  const votesDir = path.dirname(votesFile)
  if (!fs.existsSync(votesDir)) {
    fs.mkdirSync(votesDir, { recursive: true })
  }
  
  if (!fs.existsSync(votesFile)) {
    fs.writeFileSync(votesFile, JSON.stringify({}))
  }
}

// Read votes from file
function readVotes(): VotesData {
  ensureVotesFile()
  
  try {
    const data = fs.readFileSync(votesFile, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Write votes to file
function writeVotes(votes: VotesData): void {
  ensureVotesFile()
  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2))
}

// Get votes for a specific post
export function getPostVotes(postSlug: string): PostVotes {
  const allVotes = readVotes()
  return allVotes[postSlug] || { upvotes: 0, downvotes: 0, voters: [] }
}

// Get all votes
export function getAllVotes(): VotesData {
  return readVotes()
}

// Vote on a post
export function voteOnPost(
  postSlug: string, 
  voteType: 'up' | 'down', 
  voterIdentifier: string
): { success: boolean; votes: PostVotes; message?: string } {
  const allVotes = readVotes()
  const currentVotes = allVotes[postSlug] || { upvotes: 0, downvotes: 0, voters: [] }
  
  // Check if user already voted
  if (currentVotes.voters.includes(voterIdentifier)) {
    return {
      success: false,
      votes: currentVotes,
      message: 'You have already voted on this post'
    }
  }
  
  // Add vote
  if (voteType === 'up') {
    currentVotes.upvotes += 1
  } else {
    currentVotes.downvotes += 1
  }
  
  currentVotes.voters.push(voterIdentifier)
  allVotes[postSlug] = currentVotes
  
  writeVotes(allVotes)
  
  return {
    success: true,
    votes: currentVotes
  }
}

// Get voter identifier from request (IP address)
export function getVoterIdentifier(request: Request): string {
  // In a real app, you might want to use user sessions or a more sophisticated approach
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
} 