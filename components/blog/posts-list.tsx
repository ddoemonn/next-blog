'use client'

import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/blog/search'
import { VoteButtons } from '@/components/blog/vote-buttons'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import type { PostVotes } from '@/lib/votes'

interface PostsListProps {
  posts: (Post & { votes: PostVotes })[]
}

export function PostsList({ posts }: PostsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts
    return posts.filter(post => 
      post.frontMatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.frontMatter.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.frontMatter.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [posts, searchQuery])

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-medium mb-4">
            Simple thoughts, simply shared
          </h2>
          <p className="text-muted-foreground mb-8">
            A collection of ideas, insights, and experiences
          </p>
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </section>

      {/* Posts */}
      <main className="max-w-2xl mx-auto px-4 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="group">
                <div className="flex items-start gap-4">
                  <VoteButtons postSlug={post.slug} initialVotes={post.votes} />
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-2">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="group-hover:text-muted-foreground transition-colors"
                      >
                        {post.frontMatter.title}
                      </Link>
                    </h3>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {post.frontMatter.excerpt && (
                      <p className="text-muted-foreground leading-relaxed">
                        {post.frontMatter.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  )
} 