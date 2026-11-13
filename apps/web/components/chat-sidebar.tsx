"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, MessageSquare, Users, UserPlus, Hash, Lock } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { formatRelativeTime } from "@/lib/utils"

export function ChatSidebar() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createDirectMessage,
    createGroupChat,
    searchConversations,
    markAsRead,
  } = useChat()

  const [searchQuery, setSearchQuery] = useState("")
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)
  const [isNewDMOpen, setIsNewDMOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [isPrivateGroup, setIsPrivateGroup] = useState(false)
  const [newDMUser, setNewDMUser] = useState("")

  const filteredConversations = searchQuery ? searchConversations(searchQuery) : conversations

  const handleConversationClick = (conversation: any) => {
    setActiveConversation(conversation)
    if (conversation.unreadCount > 0) {
      markAsRead(conversation.id)
    }
  }

  const handleCreateGroup = async () => {
    if (groupName.trim()) {
      await createGroupChat(groupName, [])
      setGroupName("")
      setGroupDescription("")
      setIsPrivateGroup(false)
      setIsNewGroupOpen(false)
    }
  }

  const handleCreateDM = async () => {
    if (newDMUser.trim()) {
      await createDirectMessage(newDMUser)
      setNewDMUser("")
      setIsNewDMOpen(false)
    }
  }

  return (
    <div className="w-full sm:w-72 lg:w-80 xl:w-96 flex-shrink-0 border-r border-border bg-background flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Messages
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsNewDMOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                New Direct Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNewGroupOpen(true)}>
                <Users className="h-4 w-4 mr-2" />
                Create Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-2 text-xs rounded-full h-8"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 mx-0 px-2 mt-2 flex-shrink-0 bg-transparent">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="dms" className="text-xs">DMs</TabsTrigger>
          <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 overflow-hidden min-h-0">
          <ConversationList
            conversations={filteredConversations}
            activeConversation={activeConversation}
            onConversationClick={handleConversationClick}
          />
        </TabsContent>

        <TabsContent value="dms" className="flex-1 overflow-hidden min-h-0">
          <ConversationList
            conversations={filteredConversations.filter((c) => c.type === "dm")}
            activeConversation={activeConversation}
            onConversationClick={handleConversationClick}
          />
        </TabsContent>

        <TabsContent value="groups" className="flex-1 overflow-hidden min-h-0">
          <ConversationList
            conversations={filteredConversations.filter((c) => c.type === "group")}
            activeConversation={activeConversation}
            onConversationClick={handleConversationClick}
          />
        </TabsContent>
      </Tabs>

      {/* New Group Dialog */}
      <Dialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Start a new group conversation with multiple people.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-description">Description (optional)</Label>
              <Textarea
                id="group-description"
                placeholder="What's this group about?"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="private-group" checked={isPrivateGroup} onCheckedChange={setIsPrivateGroup} />
              <Label htmlFor="private-group">Private Group</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewGroupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} disabled={!groupName.trim()}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New DM Dialog */}
      <Dialog open={isNewDMOpen} onOpenChange={setIsNewDMOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Direct Message</DialogTitle>
            <DialogDescription>Start a private conversation with someone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dm-user">Username or Email</Label>
              <Input
                id="dm-user"
                placeholder="@username or email"
                value={newDMUser}
                onChange={(e) => setNewDMUser(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDMOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDM} disabled={!newDMUser.trim()}>
              Start Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ConversationListProps {
  conversations: any[]
  activeConversation: any
  onConversationClick: (conversation: any) => void
}

function ConversationList({ conversations, activeConversation, onConversationClick }: ConversationListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={`cursor-pointer transition-colors hover:bg-muted/50 border-0 ${
            activeConversation?.id === conversation.id ? "bg-muted" : ""
          }`}
          onClick={() => onConversationClick(conversation)}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {conversation.type === "group" ? <Users className="h-4 w-4" /> : conversation.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {conversation.type === "dm" && conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
                {conversation.type === "group" && (
                  <div className="absolute -bottom-1 -right-1">
                    {conversation.isPrivate ? (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Hash className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{conversation.name}</h3>
                  <div className="flex items-center space-x-1">
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                        {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.type === "group" && `${conversation.lastMessage.senderName}: `}
                    {conversation.lastMessage.content}
                  </p>
                )}

                {conversation.type === "group" && (
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    {conversation.participants.length} members
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {conversations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No conversations found</p>
        </div>
      )}
    </div>
  )
}