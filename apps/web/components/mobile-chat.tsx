"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, Paperclip, MoreVertical, MessageSquare, Users, Search, Plus } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { formatRelativeTime } from "@/lib/utils"

export function MobileChat() {
  const { conversations, activeConversation, setActiveConversation, messages, sendMessage } = useChat()
  const [messageInput, setMessageInput] = useState("")
  const [showConversations, setShowConversations] = useState(true)

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      await sendMessage(messageInput, activeConversation!.id)
      setMessageInput("")
    }
  }

  const handleConversationClick = (conversation: any) => {
    setActiveConversation(conversation)
    setShowConversations(false)
  }

  const handleBackToConversations = () => {
    setShowConversations(true)
    setActiveConversation(null)
  }

  if (showConversations || !activeConversation) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9 rounded-full" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-4 border-b border-border cursor-pointer hover:bg-muted/50"
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {conversation.type === "group" ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        conversation.name.substring(0, 2)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.type === "dm" && conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    <div className="flex items-center space-x-2">
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  </div>

                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.type === "group" && `${conversation.lastMessage.senderName}: `}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackToConversations}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {activeConversation.type === "group" ? (
                <Users className="h-4 w-4" />
              ) : (
                activeConversation.name.substring(0, 2)
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium">{activeConversation.name}</h3>
            <p className="text-sm text-muted-foreground">
              {activeConversation.type === "dm"
                ? activeConversation.isOnline
                  ? "Online"
                  : "Offline"
                : `${activeConversation.participants.length} members`}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === "current-user"
          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}>
                <Card
                  className={`${
                    isCurrentUser ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted"
                  } border-0`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-1 px-3">{formatRelativeTime(message.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 rounded-full"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
