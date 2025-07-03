'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Save, Eye, X, FileText, Monitor } from 'lucide-react'
import type { PostFrontMatter } from '@/lib/posts'
import { MDXContent } from '@/components/blog/mdx-content'

interface PostEditorProps {
  params: Promise<{
    slug: string
  }>
}

export default function PostEditor({ params }: PostEditorProps) {
  const { slug } = React.use(params)
  
  const [frontMatter, setFrontMatter] = useState<PostFrontMatter>({
    title: '',
    date: new Date().toISOString(),
    excerpt: '',
    tags: [],
    published: false,
    slug: slug
  })
  const [content, setContent] = useState('')
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    loadPost()
  }, [])

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setFrontMatter(data.post.frontMatter)
        setContent(data.post.content)
      }
    } catch (error) {
      console.error('Failed to load post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePost = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontMatter: {
            ...frontMatter,
            date: new Date().toISOString() // Always use current time
          },
          content
        })
      })

      if (response.ok) {
        router.push('/admin/posts')
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !frontMatter.tags.includes(newTag.trim())) {
      setFrontMatter(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFrontMatter(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const togglePublished = () => {
    setFrontMatter(prev => ({
      ...prev,
      published: !prev.published
    }))
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Loading post...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{frontMatter.title || 'New Post'}</h2>
            <p className="text-muted-foreground">
              Slug: {slug}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/posts')}
            >
              Cancel
            </Button>
            
            {frontMatter.published && (
              <Button
                variant="outline"
                onClick={() => router.push(`/blog/${slug}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            )}
            
            <Button
              onClick={savePost}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input
                  id="title"
                  value={frontMatter.title}
                  onChange={(e) => setFrontMatter(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={frontMatter.excerpt}
                  onChange={(e) => setFrontMatter(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content" className="text-sm font-medium">Content (Markdown)</Label>
                  <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                    <Button
                      variant={!showPreview ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setShowPreview(false)}
                      className="h-7 px-2"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={showPreview ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setShowPreview(true)}
                      className="h-7 px-2"
                    >
                      <Monitor className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                {!showPreview ? (
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content in Markdown..."
                    rows={20}
                    className="font-mono text-sm w-full"
                  />
                ) : (
                  <div className="border rounded-md p-4 min-h-[500px] bg-background">
                    {content.trim() ? (
                      <MDXContent content={content} />
                    ) : (
                      <p className="text-muted-foreground italic">Start writing to see the preview...</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Publication Status</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={frontMatter.published ? "default" : "outline"}
                    size="sm"
                    onClick={togglePublished}
                  >
                    {frontMatter.published ? 'Published' : 'Draft'}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1"
                  />
                  <Button onClick={addTag} disabled={!newTag.trim()}>
                    Add
                  </Button>
                </div>
                
                {frontMatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {frontMatter.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
} 