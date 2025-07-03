'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ComponentProps } from 'react'

interface MDXContentProps {
  content: string
}

const components = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="text-2xl font-medium mb-6 mt-8 first:mt-0" {...props} />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="text-xl font-medium mb-4 mt-8" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="text-lg font-medium mb-3 mt-6" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="leading-relaxed mb-6 text-muted-foreground" {...props} />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="list-disc ml-6 mb-6 space-y-1 text-muted-foreground" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="list-decimal ml-6 mb-6 space-y-1 text-muted-foreground" {...props} />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic my-6 text-muted-foreground" {...props} />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: ComponentProps<'pre'>) => (
    <pre className="bg-muted p-4 rounded overflow-x-auto mb-6 text-sm" {...props} />
  ),
  a: (props: ComponentProps<'a'>) => (
    <a className="underline underline-offset-2 hover:no-underline" {...props} />
  ),
  hr: (props: ComponentProps<'hr'>) => (
    <hr className="my-8 border-muted-foreground/20" {...props} />
  ),
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 