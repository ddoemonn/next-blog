import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostFrontMatter {
  title: string
  date: string
  excerpt: string
  tags: string[]
  published: boolean
  slug: string
}

export interface Post {
  slug: string
  frontMatter: PostFrontMatter
  content: string
}

// Ensure posts directory exists
export function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// Get all posts
export function getAllPosts(): Post[] {
  ensurePostsDirectory()
  
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const slug = fileName.replace(/\.mdx$/, '')
      
      return {
        slug,
        frontMatter: {
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          published: data.published || false,
          slug
        },
        content
      }
    })
    .sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime())

  return posts
}

// Get published posts only
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter(post => post.frontMatter.published)
}

// Get single post by slug
export function getPostBySlug(slug: string): Post | null {
  ensurePostsDirectory()
  
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    frontMatter: {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      published: data.published || false,
      slug
    },
    content
  }
}

// Save post
export function savePost(slug: string, frontMatter: PostFrontMatter, content: string): void {
  ensurePostsDirectory()
  
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  const fileContent = matter.stringify(content, frontMatter)
  fs.writeFileSync(fullPath, fileContent)
}

// Delete post
export function deletePost(slug: string): boolean {
  ensurePostsDirectory()
  
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
    return true
  }
  
  return false
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Create new post with auto-generated slug
export function createPost(title: string, content: string = ''): string {
  const slug = generateSlug(title)
  const date = new Date().toISOString()
  
  const frontMatter: PostFrontMatter = {
    title,
    date,
    excerpt: '',
    tags: [],
    published: false,
    slug
  }
  
  savePost(slug, frontMatter, content)
  return slug
} 