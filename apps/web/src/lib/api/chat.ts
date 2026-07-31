import type { ChatConversation, ChatMessage } from "../chat"

const API_BASE = '/api/chat'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ChatApi {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { getSession } = await import('next-auth/react')
      const session = await getSession()
      const token = (session as any)?.chatToken
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      return { success: true, data }
    } catch (error) {
      console.error(`Chat API error (${endpoint}):`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async getConversations(): Promise<ApiResponse<ChatConversation[]>> {
    return this.request<ChatConversation[]>('/conversations')
  }

  async getMessages(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>(`/messages?conversationId=${conversationId}`)
  }

  async sendMessage(
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'file' | 'audio' = 'text'
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, type })
    })
  }

  async createConversation(
    type: 'dm' | 'group',
    name: string,
    participantIds: string[]
  ): Promise<ApiResponse<ChatConversation>> {
    return this.request<ChatConversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ type, name, participantIds })
    })
  }

  async markAsRead(conversationId: string, userId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/conversations/${conversationId}/read`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    })
  }

  async searchUsers(query: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/search/users?q=${encodeURIComponent(query)}`)
  }
}

export const chatApi = new ChatApi()
