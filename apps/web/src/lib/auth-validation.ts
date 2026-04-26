/**
 * Shared authentication validation logic
 * Used across all auth pages and API routes
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim().toLowerCase()
  
  if (!trimmed) {
    return { isValid: false, error: "Email is required" }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }
  
  return { isValid: true }
}

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 number, 1 special char
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" }
  }
  
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" }
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" }
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one special character (!@#$%^&*)" }
  }
  
  return { isValid: true }
}

/**
 * Validate password match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" }
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" }
  }
  
  return { isValid: true }
}

/**
 * Validate username
 * Requirements: 3-20 chars, alphanumeric + underscore, no spaces/special chars
 */
export const validateUsername = (username: string): ValidationResult => {
  const trimmed = username.trim().toLowerCase()
  
  if (!trimmed) {
    return { isValid: false, error: "Username is required" }
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" }
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, error: "Username must be at most 20 characters" }
  }
  
  if (!/^[a-z0-9_]+$/.test(trimmed)) {
    return { isValid: false, error: "Username can only contain letters, numbers, and underscores" }
  }
  
  return { isValid: true }
}

/**
 * Validate display name
 */
export const validateDisplayName = (name: string): ValidationResult => {
  const trimmed = name.trim()
  
  if (!trimmed) {
    return { isValid: false, error: "Name is required" }
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" }
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: "Name must be at most 50 characters" }
  }
  
  return { isValid: true }
}

/**
 * Get password strength indicator
 */
export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'fair' | 'good' | 'strong'
  percentage: number
} => {
  let score = 0
  
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15
  
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
  if (score >= 25 && score < 50) strength = 'fair'
  if (score >= 50 && score < 75) strength = 'good'
  if (score >= 75) strength = 'strong'
  
  return { strength, percentage: Math.min(score, 100) }
}
