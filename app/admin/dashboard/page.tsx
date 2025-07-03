import { AdminLayout } from '@/components/admin/admin-layout'
import { getAllPosts } from '@/lib/posts'
import { getAllVotes } from '@/lib/votes'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const posts = getAllPosts()
  const votes = getAllVotes()
  
  const publishedPosts = posts.filter(post => post.frontMatter.published)
  const draftPosts = posts.filter(post => !post.frontMatter.published)
  const totalVotes = Object.values(votes).reduce((sum, vote) => sum + vote.upvotes, 0)
  const recentPosts = posts.slice(0, 5)

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-medium">{posts.length}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </div>
          <div>
            <div className="text-2xl font-medium">{publishedPosts.length}</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </div>
          <div>
            <div className="text-2xl font-medium">{totalVotes}</div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-lg font-medium mb-4">Recent Posts</h3>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No posts yet. <Link href="/admin/posts" className="underline">Create your first post</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => {
                const postVotes = votes[post.slug] || { upvotes: 0, downvotes: 0, voters: [] }
                
                return (
                  <div key={post.slug} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">{post.frontMatter.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{new Date(post.frontMatter.date).toLocaleDateString()}</span>
                        <span className={post.frontMatter.published ? 'text-green-600' : 'text-yellow-600'}>
                          {post.frontMatter.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      {postVotes.upvotes}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 