export function validateTitle(title: string): { isValid: boolean; error?: string } {
  if (!title || title.trim().length === 0) return { isValid: false, error: 'Title is required' }
  if (title.length > 140) return { isValid: false, error: 'Title must be 140 characters or less' }
  return { isValid: true }
}

export function validateScript(script: string): { isValid: boolean; error?: string } {
  if (!script || script.trim().length === 0) return { isValid: false, error: 'Script is required' }
  if (script.length < 10) return { isValid: false, error: 'Script must be at least 10 characters' }
  return { isValid: true }
}

export function validateThumbnail(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim().length === 0) return { isValid: false, error: 'Thumbnail is required' }
  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Thumbnail must be a valid URL' }
  }
}

export function validateCategory(category: string): { isValid: boolean; error?: string } {
  const valid = ['writing', 'art', 'audio', 'video', 'template', 'code', 'research']
  if (!category || !valid.includes(category)) {
    return { isValid: false, error: 'Category is required' }
  }
  return { isValid: true }
}
