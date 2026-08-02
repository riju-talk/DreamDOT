# Messaging Components

This directory contains React components for the messaging feature of the DreamDot application.

## Components

### ConversationHeader

The `ConversationHeader` component displays the header of a messaging conversation with essential information and actions.

#### Features

- **Conversation Title**: Displays the conversation name or participant names
- **Participant Avatars**: Shows avatars for all participants with:
  - Group indicator badge ("+N") for group chats with more than 2 participants
  - Avatar initials as fallback
  - Hoverable tooltip showing additional participant names
- **Online Status**: Displays a green dot indicator with online count (e.g., "1 online")
- **Typing Indicator**: Shows animated typing dots when someone is typing in the conversation
- **Search Button**: Allows users to search within the conversation
- **Menu Button**: Three-dot menu with the following options:
  - **Conversation Info**: View/edit conversation details
  - **Mute/Unmute**: Toggle notifications for the conversation
  - **Block User**: Block a user (1-on-1 conversations only)
  - **Leave**: Leave or delete the conversation
- **Design System Colors**: Uses DreamDot's color system:
  - Primary accent: `#99FF33` (lime green)
  - Background: `#121412` (dark)
  - Secondary text: `#6B8E6E` (gray-green)
  - Borders: `#2a2826` (dark gray)

#### Props

```typescript
interface ConversationHeaderProps {
  conversationId: string                          // ID of the conversation to display
  onSearchClick?: () => void                      // Callback when search button is clicked
  onInfoClick?: () => void                        // Callback when info option is clicked
  onMuteToggle?: (isMuted: boolean) => void      // Callback when mute is toggled
  onBlockUser?: (userId: string) => void         // Callback when block user is selected
  onLeaveConversation?: () => void               // Callback when leave is clicked
}
```

#### Usage

```tsx
import { ConversationHeader } from '@/app/messages/components/ConversationHeader'

export function MessagePage() {
  const [conversationId] = useState('conv-123')

  return (
    <div>
      <ConversationHeader
        conversationId={conversationId}
        onSearchClick={() => console.log('Search clicked')}
        onInfoClick={() => console.log('Info clicked')}
        onMuteToggle={(isMuted) => console.log('Mute toggled:', isMuted)}
        onBlockUser={(userId) => console.log('Block user:', userId)}
        onLeaveConversation={() => console.log('Leave conversation')}
      />
      {/* Rest of conversation UI */}
    </div>
  )
}
```

#### State Management

The component uses the Zustand `useChatStore` hook to access:
- **conversations**: List of all conversations with metadata
- **typingUsers**: Map of conversation IDs to arrays of typing user IDs
- **onlineUsers**: Array of currently online user IDs

#### Styling

The component is fully styled using Tailwind CSS with DreamDot's custom color tokens:
- Responsive header (height: 4rem / 16px)
- Smooth transitions for interactive elements
- Accessible ARIA labels and tooltips
- Mobile-friendly layout with proper spacing

#### Accessibility

- All buttons have proper ARIA labels
- Hover tooltips provide context for icon buttons
- Menu items are keyboard navigable
- Color contrast meets WCAG AA standards
- Animated indicators (typing dots) use CSS animations

#### Testing

The component includes a comprehensive test suite in `ConversationHeader.test.tsx` that covers:
- Title display with and without custom names
- Online status and participant count display
- Group chat indicators
- Menu functionality
- Callback handlers
- Design system color application
- Edge cases (no conversation selected)

#### Integration

This component is designed to be integrated into the Messages page layout:

```tsx
export function MessagesPage() {
  return (
    <div className="flex h-screen">
      {/* Conversations list */}
      <aside className="w-64 border-r">
        {/* ConversationItem components */}
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {/* ConversationHeader */}
        <ConversationHeader conversationId={activeConversationId} />

        {/* MessageList */}
        <div className="flex-1">
          {/* Messages */}
        </div>

        {/* MessageInput */}
        <footer>
          {/* Message input area */}
        </footer>
      </main>
    </div>
  )
}
```

## Related Components

- **ConversationItem**: Displays a single conversation in the conversations list sidebar
- **MessageList**: Displays messages in a conversation with virtual scrolling
- **MessageInput**: Input area for composing and sending messages
- **LivePresence**: Shows real-time online status indicators
