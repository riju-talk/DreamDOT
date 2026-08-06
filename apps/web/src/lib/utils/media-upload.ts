import { uploadFileToCloudinary } from '@/lib/cloudinaryUpload'

export interface MediaUploadResult {
  success: boolean
  url?: string
  error?: string
  type?: 'image' | 'video' | 'audio'
  width?: number
  height?: number
  duration?: number
}

export interface MediaValidationResult {
  isValid: boolean
  error?: string
  type?: 'image' | 'video' | 'audio'
  size?: number
  width?: number
  height?: number
  duration?: number
}

// Enhanced configuration with dimension limits
export const MEDIA_CONFIG = {
  // General file limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // Increased to 50MB for better support
  
  // Allowed MIME types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'image/svg+xml'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/mpeg', 'video/ogg'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/aac', 'audio/flac'],
  
  // Size limits per type
  MAX_IMAGE_SIZE: 20 * 1024 * 1024, // 20MB for high-res images
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB for videos
  MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB for audio
  
  // Dimension limits (remove or set to very high values to allow all dimensions)
  MAX_IMAGE_WIDTH: 100000, // Very high limit to effectively allow all dimensions
  MAX_IMAGE_HEIGHT: 100000,
  MIN_IMAGE_WIDTH: 1,
  MIN_IMAGE_HEIGHT: 1,
  
  MAX_VIDEO_WIDTH: 100000,
  MAX_VIDEO_HEIGHT: 100000,
  MIN_VIDEO_WIDTH: 1,
  MIN_VIDEO_HEIGHT: 1,
  
  // Duration limits (in seconds)
  MAX_VIDEO_DURATION: 3600, // 60 minutes
  MAX_AUDIO_DURATION: 7200, // 120 minutes
}

/**
 * Gets image dimensions from File object
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for dimension check'))
    }
    
    img.src = url
  })
}

/**
 * Gets video metadata from File object
 */
async function getVideoMetadata(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      })
    }
    
    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video for metadata check'))
    }
    
    video.src = url
    video.load()
  })
}

/**
 * Gets audio metadata from File object
 */
async function getAudioMetadata(file: File): Promise<{ duration: number }> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({
        duration: audio.duration
      })
    }
    
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load audio for metadata check'))
    }
    
    audio.src = url
    audio.load()
  })
}

/**
 * Validates media file before upload with dimension checks
 */
export async function validateMediaFile(file: File): Promise<MediaValidationResult> {
  try {
    // Check file size against general limit
    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds ${Math.round(MEDIA_CONFIG.MAX_FILE_SIZE / (1024 * 1024))}MB limit`
      }
    }

    // Determine file type and validate
    let type: 'image' | 'video' | 'audio'
    let maxSize: number

    if (MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      type = 'image'
      maxSize = MEDIA_CONFIG.MAX_IMAGE_SIZE
    } else if (MEDIA_CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type)) {
      type = 'video'
      maxSize = MEDIA_CONFIG.MAX_VIDEO_SIZE
    } else if (MEDIA_CONFIG.ALLOWED_AUDIO_TYPES.includes(file.type)) {
      type = 'audio'
      maxSize = MEDIA_CONFIG.MAX_AUDIO_SIZE
    } else {
      return {
        isValid: false,
        error: 'Unsupported file type. Please use supported image, video, or audio formats.'
      }
    }

    // Check type-specific size limits
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `${type} files cannot exceed ${Math.round(maxSize / (1024 * 1024))}MB`
      }
    }

    // Validate dimensions and duration based on type
    let width: number | undefined
    let height: number | undefined
    let duration: number | undefined

    if (type === 'image') {
      try {
        const dimensions = await getImageDimensions(file)
        width = dimensions.width
        height = dimensions.height
        
        // Check dimension limits (set to very high values to allow all dimensions)
        if (width < MEDIA_CONFIG.MIN_IMAGE_WIDTH || height < MEDIA_CONFIG.MIN_IMAGE_HEIGHT) {
          return {
            isValid: false,
            error: `Image dimensions too small. Minimum: ${MEDIA_CONFIG.MIN_IMAGE_WIDTH}x${MEDIA_CONFIG.MIN_IMAGE_HEIGHT}`
          }
        }
        
        if (width > MEDIA_CONFIG.MAX_IMAGE_WIDTH || height > MEDIA_CONFIG.MAX_IMAGE_HEIGHT) {
          return {
            isValid: false,
            error: `Image dimensions too large. Maximum: ${MEDIA_CONFIG.MAX_IMAGE_WIDTH}x${MEDIA_CONFIG.MAX_IMAGE_HEIGHT}`
          }
        }
      } catch (error) {
        console.warn('Could not validate image dimensions:', error)
        // Continue without dimension validation if we can't read them
      }
    } else if (type === 'video') {
      try {
        const metadata = await getVideoMetadata(file)
        width = metadata.width
        height = metadata.height
        duration = metadata.duration
        
        // Check dimension limits
        if (width < MEDIA_CONFIG.MIN_VIDEO_WIDTH || height < MEDIA_CONFIG.MIN_VIDEO_HEIGHT) {
          return {
            isValid: false,
            error: `Video dimensions too small. Minimum: ${MEDIA_CONFIG.MIN_VIDEO_WIDTH}x${MEDIA_CONFIG.MIN_VIDEO_HEIGHT}`
          }
        }
        
        if (width > MEDIA_CONFIG.MAX_VIDEO_WIDTH || height > MEDIA_CONFIG.MAX_VIDEO_HEIGHT) {
          return {
            isValid: false,
            error: `Video dimensions too large. Maximum: ${MEDIA_CONFIG.MAX_VIDEO_WIDTH}x${MEDIA_CONFIG.MAX_VIDEO_HEIGHT}`
          }
        }
        
        // Check duration
        if (duration > MEDIA_CONFIG.MAX_VIDEO_DURATION) {
          return {
            isValid: false,
            error: `Video duration too long. Maximum: ${Math.round(MEDIA_CONFIG.MAX_VIDEO_DURATION / 60)} minutes`
          }
        }
      } catch (error) {
        console.warn('Could not validate video metadata:', error)
        // Continue without metadata validation if we can't read it
      }
    } else if (type === 'audio') {
      try {
        const metadata = await getAudioMetadata(file)
        duration = metadata.duration
        
        // Check duration
        if (duration > MEDIA_CONFIG.MAX_AUDIO_DURATION) {
          return {
            isValid: false,
            error: `Audio duration too long. Maximum: ${Math.round(MEDIA_CONFIG.MAX_AUDIO_DURATION / 60)} minutes`
          }
        }
      } catch (error) {
        console.warn('Could not validate audio duration:', error)
        // Continue without duration validation if we can't read it
      }
    }

    return {
      isValid: true,
      type,
      size: file.size,
      width,
      height,
      duration
    }

  } catch (error) {
    console.error('Media validation error:', error)
    return {
      isValid: false,
      error: 'Failed to validate media file'
    }
  }
}

/**
 * Uploads media file using appropriate service
 */
export async function uploadMediaFile(file: File, folder: string = 'media'): Promise<MediaUploadResult> {
  try {
    // Validate file first
    const validation = await validateMediaFile(file)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Use Cloudinary for all supported media types
    const uploadUrl = await uploadFileToCloudinary(file, folder)

    if (!uploadUrl) {
      return {
        success: false,
        error: `Failed to upload ${validation.type} to Cloudinary`
      }
    }

    return {
      success: true,
      url: uploadUrl,
      type: validation.type,
      width: validation.width,
      height: validation.height,
      duration: validation.duration
    }

  } catch (error) {
    console.error('Media upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred during upload'
    }
  }
}

/**
 * Batch upload multiple files
 */
export async function uploadMultipleMediaFiles(
  files: File[], 
  folder: string = 'media'
): Promise<MediaUploadResult[]> {
  const uploadPromises = files.map(file => uploadMediaFile(file, folder))
  return Promise.all(uploadPromises)
}

/**
 * Converts file to base64 data URL for preview
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file as data URL'))
    reader.readAsDataURL(file)
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get file type icon/emoji
 */
export function getFileTypeIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️'
  if (type.startsWith('video/')) return '🎥'
  if (type.startsWith('audio/')) return '🎵'
  return '📎'
}

/**
 * Create a thumbnail/preview URL for media files
 */
export function createMediaPreview(file: File): string {
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    return URL.createObjectURL(file)
  }
  return ''
}

/**
 * Clean up object URLs to prevent memory leaks
 */
export function revokeObjectURL(url: string | null): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Generate a unique filename for uploads
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || 'file'
  const baseName = originalName.split('.').slice(0, -1).join('.') || originalName
  
  // Clean filename and replace spaces
  const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_')
  
  return `${cleanBaseName}_${timestamp}_${randomStr}.${extension}`
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  return MEDIA_CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type)
}

/**
 * Check if file is audio
 */
export function isAudioFile(file: File): boolean {
  return MEDIA_CONFIG.ALLOWED_AUDIO_TYPES.includes(file.type)
}