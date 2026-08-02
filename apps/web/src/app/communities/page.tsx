"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { MobileNav } from "../../../components/mobile-nav"
import { useState } from "react"
import { CommunitiesSidebar } from "./components/CommunitiesSidebar"
import { ChannelsList } from "./components/ChannelsList"
import { ChannelChat } from "./components/ChannelChat"

export default function CommunitiesPage() {
  const [selectedServer, setSelectedServer] = useState<any>(null)
  const [selectedChannel, setSelectedChannel] = useState<any>(null)

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full overflow-x-clip">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 flex flex-col overflow-hidden">
          <TopNav />
          
          {/* 3-Column Layout: Servers | Channels | Chat */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Column 1: Servers List (Left Sidebar) */}
            <div className={`${selectedServer && selectedChannel ? "hidden md:flex" : "flex"} md:flex w-full md:w-auto`}>
              <CommunitiesSidebar selectedServer={selectedServer} onSelectServer={setSelectedServer} onSelectChannel={setSelectedChannel} />
            </div>

            {/* Column 2: Channels List (Middle Sidebar) */}
            {selectedServer && (
              <div className={`${selectedChannel ? "hidden lg:flex" : "flex"} lg:flex w-full lg:w-auto`}>
                <ChannelsList server={selectedServer} selectedChannel={selectedChannel} onSelectChannel={setSelectedChannel} />
              </div>
            )}

            {/* Column 3: Chat Area (Right Main) */}
            {selectedChannel && (
              <div className={`${selectedChannel ? "flex" : "hidden md:flex"} md:flex flex-1 min-w-0`}>
                <ChannelChat channel={selectedChannel} server={selectedServer} />
              </div>
            )}

            {/* Empty State */}
            {!selectedChannel && (
              <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Select a channel</h3>
                    <p className="text-muted-foreground">Choose a server and channel to start messaging</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
