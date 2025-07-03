# next-blog

A self-hosted blog platform built with Next.js 14, MDX, and Tailwind CSS.

<img width="1683" alt="Screenshot 2025-07-03 at 14 42 44" src="https://github.com/user-attachments/assets/1f9ff2ef-dbc7-41cc-a150-2964f764dd39" />
<img width="1681" alt="Screenshot 2025-07-03 at 14 42 28" src="https://github.com/user-attachments/assets/cf3c51b7-02ec-44dc-ac24-e5c322263e24" />

## Features

- **Admin Dashboard** - Clean interface to create posts with markdown
- **Live Preview** - See your content as you write
- **Fully Customizable** - Fork and customize styling with Tailwind CSS
- **No Database** - File-based content
- **MDX Support** - Markdown with React components

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/next-blog.git
cd next-blog
bun install

# Set up environment
cp env.example .env.local
# Edit .env.local and add your JWT_SECRET

# Start development
bun dev
```

Visit `http://localhost:3000` and go to `/login` to access the admin dashboard.

## Customization

1. Fork this repository
2. Edit components in `components/`
3. Modify styles with Tailwind CSS
4. Configure site settings in `content/config/site.json`

## Deployment

Works on any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- Railway
- Self-hosted

---

**Built with Next.js, MDX, and Tailwind CSS**
