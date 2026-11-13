'use client'

import React, { useEffect, useState } from 'react'
import { ConversationHeader } from '@/app/messages/components/ConversationHeader'
import { MessageList } from '@/app/messages/components/MessageList'
import { MessageInput } from '@/app/messages/components/MessageInput'
import { LivePresence } from '@/app/messages/components/LivePresence'
import { useChatStore } from '@/lib/store/useChatStore'
import { emitJoinChannel, emitLeaveChannel } from '@/lib/socket'

interface ChannelChatProps {
  channel: any
  server: any
}

/**
 * ChannelChat Component
 * Displays messages for a channel with header and input.
 * TEXT ONLY - validates at the API/socket level, no voice/stage channels.
 */
export function ChannelChat({ channel, server }: ChannelChatProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [participants, setParticipants] = useState<{ ids: string[]; names: string[] }>({ ids: [], names: [] })

  useEffect(() => {
    if (!channel?.id || !server?.id) return

    let cancelled = false
    setIsLoading(true)

    const { setActiveConversation, upsertConversation, setMessages, hydratePresence } = useChatStore.getState()

    async function setup() {
      // Member list — needed for the header's participant/online-count display
      let ids: string[] = []
      let names: string[] = []
      try {
        const membersRes = await fetch(`/api/communities/${server.id}/members`)
        if (membersRes.ok) {
          const data = await membersRes.json()
          ids = (data.members || []).map((m: any) => m.userId)
          names = (data.members || []).map((m: any) => m.displayName || m.username || 'Member')
        }
      } catch (error) {
        console.error('[ChannelChat] Failed to load members:', error)
      }
      if (cancelled) return
      setParticipants({ ids, names })

      upsertConversation({
        id: channel.id,
        participantIds: ids,
        participantNames: names,
        name: `# ${channel.name}`,
        isGroup: true,
        unreadCount: 0,
        createdAt: new Date(),
        type: 'channel',
        serverId: server.id,
      })

      setActiveConversation(channel.id)
      hydratePresence(server.id)
      emitJoinChannel(channel.id)

      // Load message history
      try {
        const res = await fetch(`/api/communities/${server.id}/channels/${channel.id}/messages`)
        if (res.ok) {
          const data = await res.json()
          const messages = (data.messages || []).map((m: any) => ({
            id: m.id,
            conversationId: channel.id,
            userId: m.senderId,
            userName: m.senderName,
            userAvatar: m.senderAvatar,
            text: m.content,
            attachment: m.attachments?.[0],
            createdAt: new Date(m.timestamp),
            readBy: [],
          }))
          if (!cancelled) setMessages(channel.id, messages)
        }
      } catch (error) {
        console.error('[ChannelChat] Failed to load message history:', error)
      }

      if (!cancelled) setIsLoading(false)
    }

    setup()

    return () => {
      cancelled = true
      emitLeaveChannel(channel.id)
    }
  }, [channel?.id, server?.id])

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
      <div className="flex items-center justify-between border-b border-[#2a2826]">
        <div className="flex-1 min-w-0">
          <ConversationHeader
            conversationId={channel.id}
            onBackClick={() => {
              // Mobile back navigation handled by parent
            }}
          />
        </div>
        <div className="pr-4">
          <LivePresence conversationId={channel.id} participantIds={participants.ids} participantNames={participants.names} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList conversationId={channel.id} isGroup />
      </div>

      {/* Input */}
      {!isLoading && <MessageInput conversationId={channel.id} type="channel" />}
    </div>
  )
}
