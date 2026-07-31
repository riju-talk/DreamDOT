"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Users,
  Settings,
  UserPlus,
  UserMinus,
  MessageSquare,
  ImageIcon,
  File,
  Mic,
} from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { formatRelativeTime } from "@/lib/utils"
import { useSession } from "next-auth/react"

export function ChatWindow() {
  const { data: session } = useSession()
  const currentUserId = (session as any)?.user?.id
  const { activeConversation, messages, sendMessage } = useChat()
  const [messageInput, setMessageInput] = useState("")
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (messageInput.trim() || isUploading) {
      await sendMessage(messageInput, activeConversation!.id)
      setMessageInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Typically you'd upload this to ImageKit via an API endpoint here:
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadRes = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (uploadRes.ok && uploadData.url) {
        // Send the file as an attachment
        await sendMessage(messageInput || file.name, activeConversation!.id, [{
          url: uploadData.url,
          type: file.type,
          name: file.name,
          size: file.size
        }])
        setMessageInput("")
      }
    } catch (error) {
      console.error('File upload failed:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <h3 className="text-lg font-medium">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {activeConversation.type === "group" ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    activeConversation.name.substring(0, 2)
                  )}
                </AvatarFallback>
              </Avatar>
              {activeConversation.type === "dm" && activeConversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>

            <div>
              <h3 className="font-medium">{activeConversation.name}</h3>
              <p className="text-sm text-muted-foreground">
                {activeConversation.type === "dm"
                  ? activeConversation.isOnline
                    ? "Online"
                    : `Last seen ${formatRelativeTime(activeConversation.lastSeen || "")}`
                  : `${activeConversation.participants.length} members`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activeConversation.type === "dm" && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsInfoOpen(true)}>
              <Info className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {activeConversation.type === "group" && (
                  <>
                    <DropdownMenuItem>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Members
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Group Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem className="text-destructive">
                  <UserMinus className="h-4 w-4 mr-2" />
                  {activeConversation.type === "dm" ? "Block User" : "Leave Group"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId
          const showAvatar =
            !isCurrentUser &&
            (index === 0 || messages[index - 1].senderId !== message.senderId || activeConversation.type === "dm")

          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className={`flex space-x-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                {showAvatar && !isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {message.senderName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`${showAvatar || isCurrentUser ? "" : "ml-10"}`}>
                  {showAvatar && !isCurrentUser && activeConversation.type === "group" && (
                    <p className="text-xs text-muted-foreground mb-1 px-3">{message.senderName}</p>
                  )}

                  <Card
                    className={`${
                      isCurrentUser ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted"
                    } border-0`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.type !== "text" && message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.type === "image" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={message.attachments[0].url} alt="attachment" className="rounded-md max-h-60 object-contain w-full" />
                          )}
                          {message.type === "video" && (
                            <video src={message.attachments[0].url} controls className="rounded-md max-h-60 w-full" />
                          )}
                          {(message.type === "file" || message.type === "audio") && (
                            <a href={message.attachments[0].url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs bg-muted-foreground/10 p-2 rounded-md hover:bg-muted-foreground/20 transition-colors">
                              {message.type === "file" && <File className="h-4 w-4" />}
                              {message.type === "audio" && <Mic className="h-4 w-4" />}
                              <span className="truncate max-w-[150px]">{message.attachments[0].name || message.fileName || 'Download File'}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <p
                    className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? "text-right" : "text-left"} px-3`}
                  >
                    {formatRelativeTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-end space-x-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" disabled={isUploading}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Image / Video
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <File className="h-4 w-4 mr-2" />
                File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 rounded-full"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!messageInput.trim() && !isUploading) || isUploading}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="icon"
          >
            {isUploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Conversation Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{activeConversation.type === "dm" ? "Contact Info" : "Group Info"}</DialogTitle>
            <DialogDescription>
              {activeConversation.type === "dm" ? "Information about this contact" : "Information about this group"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {activeConversation.type === "group" ? (
                    <Users className="h-8 w-8" />
                  ) : (
                    activeConversation.name.substring(0, 2)
                  )}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{activeConversation.name}</h3>
              {activeConversation.type === "dm" ? (
                <p className="text-muted-foreground">
                  {activeConversation.isOnline
                    ? "Online"
                    : `Last seen ${formatRelativeTime(activeConversation.lastSeen || "")}`}
                </p>
              ) : (
                <p className="text-muted-foreground">{activeConversation.participants.length} members</p>
              )}
            </div>

            {activeConversation.type === "group" && (
              <div>
                <h4 className="font-medium mb-3">Members</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeConversation.participants.map((participant: any) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {participant.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">{participant.handle}</p>
                      </div>
                      {participant.role === "admin" && (
                        <Badge variant="outline" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
