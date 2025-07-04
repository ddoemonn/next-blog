export function calculateReadingTime(text: string): string {
  const WORDS_PER_MIN = 200
  const minutes = Math.ceil(text.trim().split(/\s+/).length / WORDS_PER_MIN)
  return `${minutes} min read`
}
