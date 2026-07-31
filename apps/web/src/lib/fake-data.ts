// Fake data generator for development
export interface FakeUser {
  id: string
  name: string
  email: string
  avatar: string
  credits: number
  followers: number
  following: number
  bio: string
}

export interface FakePost {
  id: string
  authorId: string
  author: FakeUser
  title: string
  content: string
  image?: string
  likes: number
  comments: number
  createdAt: Date
  tags: string[]
}

export interface FakeItem {
  id: string
  creatorId: string
  creator: FakeUser
  title: string
  description: string
  price: number
  category: "writing" | "audio" | "visual" | "template" | "code" | "other"
  image: string
  rating: number
  reviews: number
  sales: number
  createdAt: Date
  featured?: boolean
}

export interface FakeConversation {
  id: string
  participantIds: string[]
  participants: FakeUser[]
  lastMessage: string
  lastMessageAt: Date
  unreadCount: number
}

export interface FakeTransaction {
  id: string
  userId: string
  user: FakeUser
  amount: number
  credits: number
  type: "purchase" | "earnings" | "refund"
  status: "completed" | "pending" | "failed"
  createdAt: Date
}

const fakeUsers: FakeUser[] = [
  {
    id: "user_1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    credits: 2500,
    followers: 12400,
    following: 342,
    bio: "Digital artist & creative mind 🎨✨",
  },
  {
    id: "user_2",
    name: "Alex Rodriguez",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    credits: 5200,
    followers: 45230,
    following: 892,
    bio: "Music producer | Sound designer 🎵",
  },
  {
    id: "user_3",
    name: "Emma Watson",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    credits: 8900,
    followers: 89450,
    following: 1234,
    bio: "Writer | Storyteller | Coffee addict ☕📖",
  },
  {
    id: "user_4",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    credits: 12300,
    followers: 34500,
    following: 567,
    bio: "Developer | Open source enthusiast 💻",
  },
  {
    id: "user_5",
    name: "Sophia Lee",
    email: "sophia@example.com",
    avatar: "https://images.unsplash.com/photo-1517070213202-1fab828fb53d?w=400&h=400&fit=crop",
    credits: 6700,
    followers: 23400,
    following: 789,
    bio: "Photographer | Visual storyteller 📸",
  },
];

const fakeItems: FakeItem[] = [
  {
    id: "item_1",
    creatorId: "user_1",
    creator: fakeUsers[0],
    title: "Ultimate UI Kit - 500+ Components",
    description: "A comprehensive design system with over 500 customizable components for web and mobile applications.",
    price: 49.99,
    category: "template",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 234,
    sales: 1203,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    featured: true,
  },
  {
    id: "item_2",
    creatorId: "user_2",
    creator: fakeUsers[1],
    title: "Ambient Music Pack - 50 Tracks",
    description: "Royalty-free ambient and lo-fi music perfect for streaming, videos, and projects.",
    price: 29.99,
    category: "audio",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 456,
    sales: 2341,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    featured: true,
  },
  {
    id: "item_3",
    creatorId: "user_3",
    creator: fakeUsers[2],
    title: "The Complete Guide to Creative Writing",
    description: "Master storytelling, character development, and narrative techniques in this comprehensive course.",
    price: 39.99,
    category: "writing",
    image: "https://images.unsplash.com/photo-1507842072343-583f20270319?w=500&h=300&fit=crop",
    rating: 4.7,
    reviews: 345,
    sales: 892,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_4",
    creatorId: "user_4",
    creator: fakeUsers[3],
    title: "React Performance Optimization Guide",
    description: "Learn advanced techniques to optimize your React applications for production.",
    price: 44.99,
    category: "code",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 567,
    sales: 1543,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    featured: true,
  },
  {
    id: "item_5",
    creatorId: "user_5",
    creator: fakeUsers[4],
    title: "Cinematic Photography Presets",
    description: "10 professional Lightroom presets for creating cinematic looks in your photography.",
    price: 24.99,
    category: "visual",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop",
    rating: 4.6,
    reviews: 234,
    sales: 567,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_6",
    creatorId: "user_1",
    creator: fakeUsers[0],
    title: "Figma Design System Template",
    description: "Complete design system for building scalable products with consistency.",
    price: 59.99,
    category: "template",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 289,
    sales: 845,
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_7",
    creatorId: "user_2",
    creator: fakeUsers[1],
    title: "Synthwave Music Collection",
    description: "80s-inspired electronic music perfect for retro gaming and synthwave projects.",
    price: 34.99,
    category: "audio",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
    rating: 4.7,
    reviews: 123,
    sales: 423,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_8",
    creatorId: "user_3",
    creator: fakeUsers[2],
    title: "Blogging 101: Build Your Audience",
    description: "Strategies and tactics to start a blog and grow a loyal readership.",
    price: 19.99,
    category: "writing",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&h=300&fit=crop",
    rating: 4.5,
    reviews: 145,
    sales: 234,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_9",
    creatorId: "user_4",
    creator: fakeUsers[3],
    title: "Vue.js Advanced Patterns",
    description: "Master advanced Vue.js patterns and composables for building robust applications.",
    price: 54.99,
    category: "code",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 412,
    sales: 967,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_10",
    creatorId: "user_5",
    creator: fakeUsers[4],
    title: "Portrait Photography Masterclass",
    description: "Learn to capture stunning portraits with professional lighting and posing techniques.",
    price: 44.99,
    category: "visual",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 598,
    sales: 1876,
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    featured: true,
  },
  {
    id: "item_11",
    creatorId: "user_1",
    creator: fakeUsers[0],
    title: "Web Design Trends 2024",
    description: "Stay ahead with the latest web design trends, tools, and techniques for modern websites.",
    price: 34.99,
    category: "template",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    rating: 4.7,
    reviews: 267,
    sales: 734,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_12",
    creatorId: "user_2",
    creator: fakeUsers[1],
    title: "Electronic Music Production Starter",
    description: "Beginner-friendly guide to producing electronic music with free and paid tools.",
    price: 24.99,
    category: "audio",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
    rating: 4.6,
    reviews: 189,
    sales: 512,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_13",
    creatorId: "user_3",
    creator: fakeUsers[2],
    title: "Copywriting for Digital Products",
    description: "Write compelling copy that converts visitors into customers for your digital products.",
    price: 29.99,
    category: "writing",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 423,
    sales: 1256,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_14",
    creatorId: "user_4",
    creator: fakeUsers[3],
    title: "TypeScript Mastery Course",
    description: "Deep dive into TypeScript with real-world examples and best practices.",
    price: 64.99,
    category: "code",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 721,
    sales: 2103,
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    featured: true,
  },
  {
    id: "item_15",
    creatorId: "user_5",
    creator: fakeUsers[4],
    title: "Landscape Photography Guide",
    description: "Comprehensive guide to capturing breathtaking landscape photography in any season.",
    price: 34.99,
    category: "visual",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop",
    rating: 4.7,
    reviews: 356,
    sales: 891,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_16",
    creatorId: "user_1",
    creator: fakeUsers[0],
    title: "Prototyping with Framer",
    description: "Build interactive prototypes and animations using Framer with code and visual editor.",
    price: 39.99,
    category: "template",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 512,
    sales: 1434,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    id: "item_17",
    creatorId: "user_2",
    creator: fakeUsers[1],
    title: "Hip-Hop Production Bundle",
    description: "50+ samples, drum kits, and production tips for hip-hop beats and tracks.",
    price: 49.99,
    category: "audio",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
    rating: 4.8,
    reviews: 634,
    sales: 1823,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    featured: true,
  },
  {
    id: "item_18",
    creatorId: "user_3",
    creator: fakeUsers[2],
    title: "Content Strategy Playbook",
    description: "Proven strategies for creating and distributing content that resonates with your audience.",
    price: 44.99,
    category: "writing",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&h=300&fit=crop",
    rating: 4.9,
    reviews: 545,
    sales: 1567,
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
  },
];

const fakePosts: FakePost[] = [
  {
    id: "post_1",
    authorId: "user_3",
    author: fakeUsers[2],
    title: "The Art of Meaningful Storytelling",
    content: "Storytelling is an ancient art that has shaped civilizations. In the digital age, it remains more powerful than ever. Discover the techniques that make stories resonate with audiences...",
    image: "https://images.unsplash.com/photo-1507842072343-583f20270319?w=600&h=400&fit=crop",
    likes: 2341,
    comments: 234,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ["writing", "storytelling", "creative"],
  },
  {
    id: "post_2",
    authorId: "user_1",
    author: fakeUsers[0],
    title: "Design Trends to Watch in 2024",
    content: "From minimalism to maximalism, the design world is constantly evolving. Here are the trends that will dominate this year...",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    likes: 5634,
    comments: 456,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ["design", "trends", "ui"],
  },
  {
    id: "post_3",
    authorId: "user_4",
    author: fakeUsers[3],
    title: "Building Scalable React Applications",
    content: "When your React app grows, scalability becomes crucial. Let's explore patterns and best practices for building applications that grow with your needs...",
    likes: 3421,
    comments: 321,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ["react", "development", "javascript"],
  },
  {
    id: "post_4",
    authorId: "user_2",
    author: fakeUsers[1],
    title: "Music Production for Beginners",
    content: "Want to start producing music but don't know where to begin? This guide covers the essentials of modern music production...",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
    likes: 1876,
    comments: 145,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    tags: ["music", "production", "audio"],
  },
  {
    id: "post_5",
    authorId: "user_5",
    author: fakeUsers[4],
    title: "Photography: Mastering Composition",
    content: "Great photography isn't just about expensive equipment. It's about understanding composition, light, and timing. Let's break down the fundamentals...",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
    likes: 4532,
    comments: 267,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["photography", "composition", "tips"],
  },
  {
    id: "post_6",
    authorId: "user_1",
    author: fakeUsers[0],
    title: "Color Theory in Modern Web Design",
    content: "Understanding color psychology is essential for creating engaging digital experiences. Let's explore how colors influence user behavior and perception...",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    likes: 3892,
    comments: 287,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["design", "color-theory", "ux"],
  },
  {
    id: "post_7",
    authorId: "user_2",
    author: fakeUsers[1],
    title: "The Evolution of Electronic Music",
    content: "From the birth of synthesizers to modern digital production, electronic music has transformed the industry. A deep dive into its rich history...",
    likes: 2156,
    comments: 178,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: ["music", "history", "electronic"],
  },
  {
    id: "post_8",
    authorId: "user_3",
    author: fakeUsers[2],
    title: "SEO Best Practices for Content Creators",
    content: "Want your content to rank higher? Learn the essential SEO techniques that top creators use to reach wider audiences...",
    likes: 4123,
    comments: 342,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    tags: ["seo", "content", "marketing"],
  },
  {
    id: "post_9",
    authorId: "user_4",
    author: fakeUsers[3],
    title: "JavaScript Async/Await Deep Dive",
    content: "Master asynchronous JavaScript with this comprehensive guide to async/await patterns and error handling strategies...",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    likes: 5234,
    comments: 467,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    tags: ["javascript", "async", "development"],
  },
  {
    id: "post_10",
    authorId: "user_5",
    author: fakeUsers[4],
    title: "Lighting Techniques Every Photographer Should Know",
    content: "Professional lighting can make or break a photograph. Here's everything you need to know about natural and artificial lighting...",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
    likes: 3567,
    comments: 289,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    tags: ["photography", "lighting", "technical"],
  },
  {
    id: "post_11",
    authorId: "user_1",
    author: fakeUsers[0],
    title: "Responsive Design: Mobile-First Approach",
    content: "Building responsive designs is no longer optional. Learn why a mobile-first approach is the gold standard for modern web design...",
    likes: 2876,
    comments: 201,
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    tags: ["design", "responsive", "mobile"],
  },
  {
    id: "post_12",
    authorId: "user_3",
    author: fakeUsers[2],
    title: "How to Find Your Unique Writing Voice",
    content: "Your writing voice is what sets you apart from other writers. Discover practical tips for developing and strengthening your unique perspective...",
    likes: 3145,
    comments: 256,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    tags: ["writing", "voice", "craft"],
  },
];

const fakeConversations: FakeConversation[] = [
  {
    id: "conv_1",
    participantIds: ["user_1", "user_2"],
    participants: [fakeUsers[0], fakeUsers[1]],
    lastMessage: "Awesome! Let's collaborate on the next project 🎨",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 2,
  },
  {
    id: "conv_2",
    participantIds: ["user_3", "user_4"],
    participants: [fakeUsers[2], fakeUsers[3]],
    lastMessage: "Thanks for the feedback on the article!",
    lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "conv_3",
    participantIds: ["user_2", "user_5"],
    participants: [fakeUsers[1], fakeUsers[4]],
    lastMessage: "Your photography is incredible! 📸",
    lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    unreadCount: 1,
  },
];

const fakeTransactions: FakeTransaction[] = [
  {
    id: "txn_1",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 49.99,
    credits: 500,
    type: "purchase",
    status: "completed",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "txn_2",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 245.50,
    credits: 0,
    type: "earnings",
    status: "completed",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: "txn_3",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 29.99,
    credits: 300,
    type: "purchase",
    status: "completed",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: "txn_4",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 567.25,
    credits: 0,
    type: "earnings",
    status: "completed",
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
  },
  {
    id: "txn_5",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 15.00,
    credits: 150,
    type: "purchase",
    status: "completed",
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000),
  },
  {
    id: "txn_6",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 128.75,
    credits: 0,
    type: "earnings",
    status: "completed",
    createdAt: new Date(Date.now() - 144 * 60 * 60 * 1000),
  },
  {
    id: "txn_7",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 89.99,
    credits: 1000,
    type: "purchase",
    status: "completed",
    createdAt: new Date(Date.now() - 168 * 60 * 60 * 1000),
  },
  {
    id: "txn_8",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 342.10,
    credits: 0,
    type: "earnings",
    status: "completed",
    createdAt: new Date(Date.now() - 192 * 60 * 60 * 1000),
  },
  {
    id: "txn_9",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 34.99,
    credits: 350,
    type: "purchase",
    status: "completed",
    createdAt: new Date(Date.now() - 216 * 60 * 60 * 1000),
  },
  {
    id: "txn_10",
    userId: "user_1",
    user: fakeUsers[0],
    amount: 456.80,
    credits: 0,
    type: "earnings",
    status: "completed",
    createdAt: new Date(Date.now() - 240 * 60 * 60 * 1000),
  },
];

export function getFakeUsers(): FakeUser[] {
  return fakeUsers;
}

export function getFakeUserById(id: string): FakeUser | undefined {
  return fakeUsers.find((u) => u.id === id);
}

export function getFakeItems(): FakeItem[] {
  return fakeItems;
}

export function getFakeFeaturedItems(): FakeItem[] {
  return fakeItems.filter((item) => item.featured);
}

export function getFakeItemsByCategory(category: string): FakeItem[] {
  return fakeItems.filter((item) => item.category === category);
}

export function getFakePosts(): FakePost[] {
  return fakePosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getFakeConversations(): FakeConversation[] {
  return fakeConversations.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

export function getFakeTransactions(): FakeTransaction[] {
  return fakeTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getCurrentUser(): FakeUser {
  return fakeUsers[0]; // Default to Sarah Chen for demo
}
