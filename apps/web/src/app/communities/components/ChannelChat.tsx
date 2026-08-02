'use client'

import React, { useEffect, useState } from 'react'
import { ConversationHeader } from '@/app/messages/components/ConversationHeader'
import { MessageList } from '@/app/messages/components/MessageList'
import { MessageInput } from '@/app/messages/components/MessageInput'
import { useSession } from 'next-auth/react'

interface ChannelChatProps {
  channel: any
  server: any
}

/**
 * ChannelChat Component
 * Displays messages for a channel with header and input
 * TEXT ONLY - validates at API level, no voice/stage channels
 */
export function ChannelChat({ channel, server }: ChannelChatProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (channel?.id) {
      setIsLoading(false)
    }
  }, [channel])

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121412]">
        <div className="text-center">
          <p className="text-[#6B8E6E]">Select a channel to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#121412]">
      {/* Header */}
      <ConversationHeader
        conversationId={channel.id}
        onBackClick={() => {
          // Mobile back navigation handled by parent
        }}
      />

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList conversationId={channel.id} />
      </div>

      {/* Input */}
      <MessageInput conversationId={channel.id} />
    </div>
  )
}
