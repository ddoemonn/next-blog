'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Edit, Calendar, Tag } from 'lucide-react'
import type { Post } from '@/lib/posts'

export default function PostPicker() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = posts.filter(post => 
        post.frontMatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontMatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontMatter.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(posts)
    }
  }, [searchQuery, posts])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data.posts || [])
      setFilteredPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectPost = (slug: string) => {
    router.push(`/admin/posts/edit/${slug}`)
  }

  if (isLoading) {
    return (
      <AdminLayout title="Select Post to Edit">
        <div className="text-center py-8">Loading posts...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Select Post to Edit">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Choose a Post to Edit</h2>
          <p className="text-muted-foreground mt-2">
            Select from {posts.length} available posts
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search posts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No posts match your search' : 'No posts available'}
              </p>
              {!searchQuery && (
                <Button onClick={() => router.push('/admin/posts')}>
                  Create your first post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card 
                key={post.slug} 
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => selectPost(post.slug)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {post.frontMatter.title}
                    </CardTitle>
                    <Badge variant={post.frontMatter.published ? 'default' : 'secondary'}>
                      {post.frontMatter.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.frontMatter.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.frontMatter.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.frontMatter.date).toLocaleDateString()}
                  </div>
                  
                  {post.frontMatter.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {post.frontMatter.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.frontMatter.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.frontMatter.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectPost(post.slug)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 