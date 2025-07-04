'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/blog/search'
import { VoteButtons } from '@/components/blog/vote-buttons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/ui/mode-toggle'
import Link from 'next/link'
import { 
  Clock,
  BookOpen,
  Filter,
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Post } from '@/lib/posts'
import type { PostVotes } from '@/lib/votes'
import { calculateReadingTime } from '@/lib/reading-time'

interface PlayfulLandingProps {
  posts: (Post & { votes: PostVotes })[]
}

export function PlayfulLanding({ posts }: PlayfulLandingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = posts.flatMap(post => post.frontMatter.tags)
    return Array.from(new Set(tags))
  }, [posts])

  // Split tags for display (show first 5, rest in dropdown)
  const maxVisibleTags = 5
  const visibleTags = allTags.slice(0, maxVisibleTags)
  const dropdownTags = allTags.slice(maxVisibleTags)

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = posts
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.frontMatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontMatter.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontMatter.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.frontMatter.tags.includes(selectedTag)
      )
    }
    
    return filtered
  }, [posts, searchQuery, selectedTag])

  return (
    <div className="min-h-screen relative">
      {/* Vertical dashed borders aligned with header elements */}
      <div className="absolute top-20 bottom-0 w-full z-0 pointer-events-none">
        <div className="max-w-4xl mx-auto px-4 relative h-full">
          {/* Line under "Blog" text */}
          <div className="absolute left-4 top-0 bottom-0 w-px border-l-2 border-dashed border-muted-foreground/15 pointer-events-none"></div>
          {/* Line under toggle button */}
          <div className="absolute right-4 top-0 bottom-0 w-px border-l-2 border-dashed border-muted-foreground/15 pointer-events-none"></div>
        </div>
      </div>
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-medium relative"
              id="blog-title"
            >
              Blog
            </motion.h1>
            
            <div className="relative" id="mode-toggle">
              <ModeToggle />
            </div>
          </div>
        </div>
        
        {/* Full-width dashed border at bottom of navbar */}
        <div className="w-full border-b-2 border-dashed border-muted-foreground/20"></div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-8 relative z-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-medium mb-4">
              Simple thoughts, simply shared
            </h2>
            <p className="text-muted-foreground mb-8">
              A collection of ideas, insights, and experiences
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <SearchBar onSearch={setSearchQuery} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pb-8 relative z-10"
        >
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Filter by topic</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedTag === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className={`rounded-full text-xs border border-border cursor-pointer ${
                  selectedTag === null ? '' : 'hover:bg-muted hover:text-foreground'
                }`}
              >
                All
              </Button>
              
              {/* Show first 5 tags inline */}
              {visibleTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Button
                    variant={selectedTag === tag ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`rounded-full text-xs border border-border cursor-pointer ${
                      selectedTag === tag ? '' : 'hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {tag}
                  </Button>
                </motion.div>
              ))}
              
              {/* Dropdown for remaining tags if there are more than 5 */}
              {dropdownTags.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs border border-border cursor-pointer hover:bg-muted hover:text-foreground flex items-center gap-1"
                    >
                      More tags
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    {dropdownTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`cursor-pointer ${
                          selectedTag === tag ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {tag}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Posts Section */}
      <main className="max-w-2xl mx-auto px-4 pt-8 pb-16 relative z-10">
        {filteredPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedTag ? 'No posts found' : 'No posts yet'}
            </p>
            {(searchQuery || selectedTag) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag(null)
                }}
                size="sm"
              >
                Clear filters
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-12">
            {filteredPosts.map((post, index) => (
              <motion.article 
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="group"
              >
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
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {calculateReadingTime(post.content)}
                      </div>
                    </div>
                    
                    {post.frontMatter.excerpt && (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {post.frontMatter.excerpt}
                      </p>
                    )}
                    
                    {post.frontMatter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.frontMatter.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => setSelectedTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 