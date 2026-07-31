
"use client"

import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3001'

export function useSocket() {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // access token may be attached to the NextAuth session object at runtime
  // its type isn't declared on the library Session type here, so read it
  // via an any-cast to avoid TypeScript errors while keeping runtime logic.
  const token = (session as any)?.chatToken

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Create socket connection with NextAuth JWT token
    const newSocket = io(CHAT_SERVER_URL, {
      auth: {
        token
      },
      autoConnect: true
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  const sendMessage = (message: any, callback?: (response: any) => void) => {
    if (socket && isConnected) {
      socket.emit('message:send', message, callback)
    }
  }

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('room:join', { conversationId: roomId })
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('room:leave', { conversationId: roomId })
    }
  }

  const setTyping = (conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('message:typing', { conversationId, isTyping })
    }
  }

  return {
    socket,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    setTyping
  }
}

export function useChat(conversationId?: string) {
  const { socket, isConnected, sendMessage, joinRoom, leaveRoom, setTyping } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return

    // Join conversation room using the correct event name
    socket.emit('room:join', { conversationId })

    return () => {
      // Leave conversation room using the correct event name
      socket.emit('room:leave', { conversationId })
    }
  }, [socket, isConnected, conversationId])

  return {
    socket,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    setTyping
  }
}
