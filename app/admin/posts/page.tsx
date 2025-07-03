'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import type { Post } from '@/lib/posts'

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createPost = async () => {
    if (!newPostTitle.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPostTitle })
      })

      const data = await response.json()
      if (response.ok) {
        setShowCreateDialog(false)
        setNewPostTitle('')
        router.push(`/admin/posts/edit/${data.slug}`)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const deletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Posts">
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Loading...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Posts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {posts.length} posts
          </p>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <Plus className="h-3 w-3 mr-1" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter post title..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createPost()}
                  className="h-8"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={createPost} disabled={isCreating || !newPostTitle.trim()}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-3">No posts yet</p>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              Create your first post
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between py-3 px-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{post.frontMatter.title}</h3>
                    <Badge variant={post.frontMatter.published ? 'default' : 'secondary'} className="text-xs h-4">
                      {post.frontMatter.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(post.frontMatter.date).toLocaleDateString()}</span>
                    {post.frontMatter.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{post.frontMatter.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-3">
                  {post.frontMatter.published && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                      className="h-7 w-7 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/posts/edit/${post.slug}`)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePost(post.slug)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 