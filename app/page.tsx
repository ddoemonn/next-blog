import { getPublishedPosts } from '@/lib/posts'
import { getPostVotes } from '@/lib/votes'
import { PlayfulLanding } from '@/components/blog/playful-landing'

export default function HomePage() {
  const posts = getPublishedPosts()
  
  // Add votes data to each post
  const postsWithVotes = posts.map(post => ({
    ...post,
    votes: getPostVotes(post.slug)
  }))

  return <PlayfulLanding posts={postsWithVotes} />
}
