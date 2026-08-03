'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Plus,
  Search,
  MessageCircle,
  Users,
  Settings,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import MessageList from './components/MessageList'

interface DMConversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

interface Community {
  id: string
  name: string
  description?: string
  ownerId: string
  channels: Channel[]
  memberCount: number
  role: 'owner' | 'member'
}

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice'
  topic?: string
  position: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const { theme } = useTheme()

  const [activeTab, setActiveTab] = useState<'dms' | 'communities'>('dms')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  const [dms, setDms] = useState<DMConversation[]>([])
  const [communities, setCommunities] = useState<Community[]>([])

  const [isLoadingDMs, setIsLoadingDMs] = useState(true)
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false)
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false)
  const [communityFormData, setCommunityFormData] = useState({
    name: '',
    description: '',
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return

    async function loadData() {
      try {
        // Load DMs
        setIsLoadingDMs(true)
        const dmsRes = await fetch('/api/messages/dms')
        if (dmsRes.ok) {
          const dmsData = await dmsRes.json()
          setDms(dmsData.conversations || [])
          if (dmsData.conversations.length > 0 && !selectedConversation) {
            setSelectedConversation(dmsData.conversations[0].id)
          }
        }
        setIsLoadingDMs(false)

        // Load Communities
        setIsLoadingCommunities(true)
        const commRes = await fetch('/api/communities')
        if (commRes.ok) {
          const commData = await commRes.json()
          setCommunities(commData.communities || [])
          if (commData.communities.length > 0 && !selectedCommunity) {
            setSelectedCommunity(commData.communities[0].id)
            if (commData.communities[0].channels.length > 0) {
              setSelectedChannel(commData.communities[0].channels[0].id)
            }
          }
        }
        setIsLoadingCommunities(false)
      } catch (error) {
        console.error('[Messages] Error loading data:', error)
        setIsLoadingDMs(false)
        setIsLoadingCommunities(false)
      }
    }

    loadData()
  }, [session?.user?.id, selectedConversation, selectedCommunity])

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!communityFormData.name.trim()) return

    try {
      setIsCreatingCommunity(true)
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communityFormData),
      })

      if (res.ok) {
        const data = await res.json()
        setCommunities([...communities, data.community])
        setSelectedCommunity(data.community.id)
        if (data.community.channels.length > 0) {
          setSelectedChannel(data.community.channels[0].id)
        }
        setCommunityFormData({ name: '', description: '' })
        setShowCreateCommunityModal(false)
      }
    } catch (error) {
      console.error('[Messages] Error creating community:', error)
    } finally {
      setIsCreatingCommunity(false)
    }
  }

  if (!mounted) return null

  const filteredDMs = dms.filter((dm) =>
    dm.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCommunities = communities.filter((comm) =>
    comm.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeDM = selectedConversation ? dms.find((d) => d.id === selectedConversation) : null
  const activeCommunity = selectedCommunity ? communities.find((c) => c.id === selectedCommunity) : null
  const activeChannel = activeCommunity?.channels.find((ch) => ch.id === selectedChannel)

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background text-foreground flex gap-0">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-80 border-r border-border bg-card flex flex-col h-screen"
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-black italic font-serif text-foreground">Messages</h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowCreateCommunityModal(true)}
                className="rounded-full hover:bg-muted"
              >
                <Plus className="w-5 h-5 text-[#5a8c5a] dark:text-primary" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-full text-sm outline-none focus:ring-2 focus:ring-[#5a8c5a] dark:focus:ring-primary"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 pt-4 border-b border-border">
            <button
              onClick={() => setActiveTab('dms')}
              className={`px-4 py-2 font-bold uppercase text-xs transition-all relative ${
                activeTab === 'dms'
                  ? 'text-[#5a8c5a] dark:text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              DMs
              {activeTab === 'dms' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5a8c5a] dark:bg-primary rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-4 py-2 font-bold uppercase text-xs transition-all relative ${
                activeTab === 'communities'
                  ? 'text-[#5a8c5a] dark:text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Communities
              {activeTab === 'communities' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5a8c5a] dark:bg-primary rounded-t-full" />
              )}
            </button>
          </div>

          {/* DMs List */}
          {activeTab === 'dms' && (
            <div className="flex-1 overflow-y-auto">
              {isLoadingDMs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-[#5a8c5a] dark:text-primary" />
                </div>
              ) : filteredDMs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-bold">No DMs yet</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredDMs.map((dm) => (
                    <motion.button
                      key={dm.id}
                      onClick={() => setSelectedConversation(dm.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left p-3 rounded-lg transition-colors relative group ${
                        selectedConversation === dm.id
                          ? 'bg-[#5a8c5a]/10 dark:bg-primary/10 border border-[#5a8c5a] dark:border-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
                          {dm.participantAvatar ? (
                            <Image
                              src={dm.participantAvatar}
                              alt={dm.participantName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            dm.participantName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground truncate">{dm.participantName}</p>
                          <p className="text-xs text-muted-foreground truncate">{dm.lastMessage || 'No messages yet'}</p>
                        </div>
                        {dm.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#5a8c5a] dark:bg-primary text-white text-xs font-bold flex-shrink-0">
                            {dm.unreadCount}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Communities List */}
          {activeTab === 'communities' && (
            <div className="flex-1 overflow-y-auto">
              {isLoadingCommunities ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-[#5a8c5a] dark:text-primary" />
                </div>
              ) : filteredCommunities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-bold">No communities yet</p>
                  <Button
                    onClick={() => setShowCreateCommunityModal(true)}
                    size="sm"
                    className="mt-4 bg-[#5a8c5a] dark:bg-primary"
                  >
                    Create one
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 p-2">
                  {filteredCommunities.map((community) => (
                    <div
                      key={community.id}
                      className={`p-3 rounded-lg transition-colors border ${
                        selectedCommunity === community.id
                          ? 'bg-[#5a8c5a]/10 dark:bg-primary/10 border-[#5a8c5a] dark:border-primary'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {/* Community Header */}
                      <motion.button
                        onClick={() => setSelectedCommunity(community.id)}
                        whileHover={{ x: 4 }}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-sm text-foreground truncate">{community.name}</p>
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedCommunity === community.id ? 'rotate-90' : ''}`} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{community.description || 'No description'}</p>
                      </motion.button>

                      {/* Channels */}
                      <AnimatePresence>
                        {selectedCommunity === community.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 pt-2 border-t border-border/50 space-y-1"
                          >
                            {community.channels.map((channel) => (
                              <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel.id)}
                                className={`w-full text-left px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                                  selectedChannel === channel.id
                                    ? 'bg-[#5a8c5a] dark:bg-primary text-white'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                              >
                                # {channel.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Chat Header */}
          {(activeDM || activeChannel) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-border p-4 flex items-center justify-between bg-card"
            >
              <div>
                {activeDM && (
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{activeDM.participantName}</h2>
                    <p className="text-xs text-muted-foreground">Active on Ethereal</p>
                  </div>
                )}
                {activeChannel && activeCommunity && (
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{activeCommunity.name}</h2>
                    <p className="text-xs text-muted-foreground"># {activeChannel.name}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Messages + Details */}
          <div className="flex-1 flex gap-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              <MessageList
                conversationId={activeTab === 'dms' ? selectedConversation : selectedChannel}
                isGroup={activeTab === 'communities'}
              />

              {/* Message Input */}
              {(activeDM || activeChannel) && (
                <div className="border-t border-border p-4 bg-card">
                  <form className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Send a message..."
                      className="flex-1 bg-muted rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5a8c5a] dark:focus:ring-primary"
                    />
                    <Button className="rounded-full bg-[#5a8c5a] dark:bg-primary text-white hover:bg-[#4a7c4a] dark:hover:bg-primary/90">
                      Send
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Community Details Panel */}
            {activeCommunity && activeTab === 'communities' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 border-l border-border bg-card p-6 overflow-y-auto space-y-6"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#5a8c5a] dark:text-primary mb-2">Project</p>
                  <h3 className="text-2xl font-black italic font-serif text-foreground">{activeCommunity.name}</h3>
                </div>

                {activeCommunity.description && (
                  <p className="text-sm leading-relaxed text-foreground/80">{activeCommunity.description}</p>
                )}

                {/* Participants */}
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">Participants ({activeCommunity.memberCount})</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white text-xs font-bold" />
                        <div>
                          <p className="text-sm font-bold text-foreground">Member {i}</p>
                          <p className="text-xs text-muted-foreground">Role</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Create Community Modal */}
        <AnimatePresence>
          {showCreateCommunityModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black italic font-serif text-foreground">Create Community</h2>
                  <button
                    onClick={() => setShowCreateCommunityModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCommunity} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Community Name
                    </label>
                    <input
                      type="text"
                      value={communityFormData.name}
                      onChange={(e) =>
                        setCommunityFormData({ ...communityFormData, name: e.target.value })
                      }
                      placeholder="e.g., Product Design Team"
                      className="w-full bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5a8c5a] dark:focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={communityFormData.description}
                      onChange={(e) =>
                        setCommunityFormData({ ...communityFormData, description: e.target.value })
                      }
                      placeholder="What's this community about?"
                      className="w-full bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5a8c5a] dark:focus:ring-primary resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateCommunityModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreatingCommunity || !communityFormData.name.trim()}
                      className="flex-1 bg-[#5a8c5a] dark:bg-primary text-white hover:bg-[#4a7c4a] dark:hover:bg-primary/90"
                    >
                      {isCreatingCommunity ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create'
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  )
}
