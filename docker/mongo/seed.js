// MongoDB Seed Data for DreamDot
// Initializes test data with actual content bodies

db = db.getSiblingDB('dreamdot');

// ==================== USERS COLLECTION ====================
db.users.insertMany([
  {
    _id: "550e8400-e29b-41d4-a716-446655440001",
    email: "alice@dreamdot.com",
    name: "Alice Wonder",
    avatar: "https://i.pravatar.cc/150?img=1",
    credits: 1250,
    createdAt: new Date(Date.now() - 90*24*60*60*1000), // 90 days ago
    updatedAt: new Date()
  },
  {
    _id: "550e8400-e29b-41d4-a716-446655440002",
    email: "bob@dreamdot.com",
    name: "Bob Writer",
    avatar: "https://i.pravatar.cc/150?img=2",
    credits: 3450,
    createdAt: new Date(Date.now() - 60*24*60*60*1000),
    updatedAt: new Date()
  },
  {
    _id: "550e8400-e29b-41d4-a716-446655440003",
    email: "charlie@dreamdot.com",
    name: "Charlie Coder",
    avatar: "https://i.pravatar.cc/150?img=3",
    credits: 890,
    createdAt: new Date(Date.now() - 45*24*60*60*1000),
    updatedAt: new Date()
  },
  {
    _id: "550e8400-e29b-41d4-a716-446655440004",
    email: "diana@dreamdot.com",
    name: "Diana Sound",
    avatar: "https://i.pravatar.cc/150?img=4",
    credits: 5600,
    createdAt: new Date(Date.now() - 30*24*60*60*1000),
    updatedAt: new Date()
  }
]);

// ==================== POSTS COLLECTION ====================
// NOTE: Actual post content bodies (text, media arrays, etc.)
// Metadata (likes count, views, visibility) is in PostgreSQL.posts
db.posts.insertMany([
  {
    _id: "mongo_post_001",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    sqlId: "660e8400-e29b-41d4-a716-446655440001", // Links to PostgreSQL posts.id
    content: "Just finished an amazing digital painting! Used a new technique I learned on YouTube. The colors came out so vibrant and the lighting is finally how I wanted it. Took 8 hours but totally worth it! Check out the detail on the sunset gradient 🌅✨",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1537720999062-cc4845f2e766?w=800&h=600&fit=crop",
        alt: "Digital sunset artwork with vibrant colors"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
        alt: "Close-up detail of gradient technique"
      }
    ],
    visibility: true,
    likes: ["550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440003"],
    comments: [
      {
        userId: "550e8400-e29b-41d4-a716-446655440002",
        text: "This is absolutely stunning Alice! Love your color palette 🎨",
        timestamp: new Date()
      },
      {
        userId: "550e8400-e29b-41d4-a716-446655440004",
        text: "The detail work is incredible. How long did the lighting take?",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 7*24*60*60*1000),
    updatedAt: new Date(Date.now() - 7*24*60*60*1000)
  },
  {
    _id: "mongo_post_002",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    sqlId: "660e8400-e29b-41d4-a716-446655440002",
    content: "Tutorial time! 🎓 Creating gradient meshes can seem intimidating at first, but with these 5 simple steps, you'll be a pro in no time. 1️⃣ Select your shape 2️⃣ Go to Object > Create Gradient Mesh 3️⃣ Set your rows & columns 4️⃣ Click and drag anchor points 5️⃣ Adjust colors at each node. Tag someone who needs to learn this!",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        alt: "Design software interface with gradient mesh tutorial"
      }
    ],
    visibility: true,
    likes: ["550e8400-e29b-41d4-a716-446655440003", "550e8400-e29b-41d4-a716-446655440002"],
    comments: [
      {
        userId: "550e8400-e29b-41d4-a716-446655440003",
        text: "This is so helpful! Bookmarking for later.",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 5*24*60*60*1000),
    updatedAt: new Date(Date.now() - 5*24*60*60*1000)
  }
]);

  {
    _id: "mongo_post_003",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    sqlId: "660e8400-e29b-41d4-a716-446655440003",
    content: "📖 CHAPTER 1: THE AWAKENING is LIVE! After 18 months of writing, rewriting, and caffeine-fueled editing marathons, The Last Horizon is finally ready for readers. This sci-fi epic follows Commander Kara as she discovers an impossible signal from beyond the known universe. But nothing is what it seems... 👀\n\nRead the full first chapter on my Patreon or grab the ebook today! Your support means everything to me. 💙",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1507842620956-583a6da548bb?w=800&h=600&fit=crop",
        alt: "Book cover design for The Last Horizon"
      }
    ],
    visibility: true,
    likes: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440003", "550e8400-e29b-41d4-a716-446655440004"],
    comments: [
      {
        userId: "550e8400-e29b-41d4-a716-446655440001",
        text: "Finally! I've been waiting for this. Downloading now!",
        timestamp: new Date()
      },
      {
        userId: "550e8400-e29b-41d4-a716-446655440003",
        text: "The premise sounds incredible. Can't wait to start reading!",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 3*24*60*60*1000),
    updatedAt: new Date(Date.now() - 3*24*60*60*1000)
  },
  {
    _id: "mongo_post_004",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    sqlId: "660e8400-e29b-41d4-a716-446655440004",
    content: "✍️ WRITING TIP #42: Character Development Through Conflict\n\nYour characters should transform through the challenges they face. The best way to develop a compelling protagonist is to:\n\n1. Give them a meaningful goal\n2. Create obstacles that force them to make difficult choices\n3. Let them fail sometimes (failure builds character!)\n4. Show how each experience changes them\n\nThe more your character struggles, the more readers will care about their journey. What's your favorite character arc from a book or film?",
    media: [],
    visibility: true,
    likes: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440003"],
    comments: [
      {
        userId: "550e8400-e29b-41d4-a716-446655440001",
        text: "This is gold. Saving this for when I start my novel!",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 2*24*60*60*1000),
    updatedAt: new Date(Date.now() - 2*24*60*60*1000)
  },
  {
    _id: "mongo_post_005",
    userId: "550e8400-e29b-41d4-a716-446655440004",
    sqlId: "660e8400-e29b-41d4-a716-446655440005",
    content: "🎵 NEW TRACK ALERT: 'Ambient Dream' is out now! \n\nA 12-minute ambient journey created with modular synth, field recordings from a rainy Tokyo street, and processed piano. Perfect for deep work, meditation, or late-night studying. \n\nFree download link in bio! Also available on Spotify, Apple Music, and Bandcamp. 🌙✨\n\nThank you to everyone who supported this release!",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
        alt: "Album artwork for Ambient Dream - moody blue and purple abstract"
      }
    ],
    visibility: true,
    likes: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"],
    comments: [
      {
        userId: "550e8400-e29b-41d4-a716-446655440002",
        text: "Listened to this while working and it's exactly what I needed. Incredible vibe!",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 1*24*60*60*1000),
    updatedAt: new Date(Date.now() - 1*24*60*60*1000)
  }
]);

// ==================== ITEMS COLLECTION ====================
// NOTE: Actual item content (scripts, full metadata, DRM configs)
// Relational data (pricing, ownership) is in PostgreSQL.items
db.items.insertMany([
  {
    _id: "mongo_item_001",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    sqlId: "990e8400-e29b-41d4-a716-446655440001",
    title: "Urban Landscape Digital Art Pack",
    description: "High-resolution digital illustration pack featuring 5 stunning urban scenes",
    script: "This premium collection includes:\n\n📐 5 Full-resolution Illustrations (4K)\n- Neon city streets at night\n- Modern architecture close-ups\n- Urban park at sunset\n- Subway station atmosphere\n- Rooftop cityscape\n\n✨ Files included:\n- PSD (Photoshop) with editable layers\n- PNG (transparent background)\n- JPG (full color)\n\n💡 Use for:\n- Book covers\n- Web design inspiration\n- Digital backgrounds\n- Print materials\n- Commercial projects (with attribution)\n\n📝 License: Personal + Commercial\n🔐 Full ownership after purchase",
    category: "illustration",
    pricingModel: "paid",
    priceCredits: 2999,
    visibility: "public",
    media: [
      {
        url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=800&fit=crop",
        mimeType: "image/jpeg",
        size: 2457600,
        width: 1920,
        height: 1080
      },
      {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
        mimeType: "image/jpeg",
        size: 2097152,
        width: 1920,
        height: 1080
      },
      {
        url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop",
        mimeType: "image/jpeg",
        size: 2359296,
        width: 1920,
        height: 1080
      }
    ],
    tags: ["urban", "art", "digital", "illustration", "design", "4k"],
    drmEnabled: true,
    drmConfig: {
      watermarkOpacity: 0.15,
      disableRightClick: true,
      disableTextSelect: true
    },
    metadata: {
      fileSize: "1.2GB",
      resolution: "4096x2160",
      colorSpace: "sRGB",
      format: "PSD, PNG, JPG"
    },
    createdAt: new Date(Date.now() - 60*24*60*60*1000),
    updatedAt: new Date()
  },
  {
    _id: "mongo_item_002",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    sqlId: "990e8400-e29b-41d4-a716-446655440002",
    title: "The Last Horizon - Full Novel",
    description: "Epic science fiction novel (250k words) - First in series",
    script: "THE LAST HORIZON\nBy Bob Writer\n\nPrologues:\nYear 2247 - The Signal\n\nThe observation deck of the ISS-7 stretched out like a cathedral of steel and glass. Dr. Sarah Chen pressed her palm against the cool surface, staring into the void beyond Earth's atmosphere. After fifteen years studying cosmic radiation patterns, she thought she'd seen everything the universe had to offer.\n\nShe was about to be proven catastrophically wrong.\n\n\"Sarah, you need to see this,\" her colleague's voice crackled through the comm. Static. Then again: \"Sarah. Come to the lab. Now.\"\n\nCHAPTER ONE: THE AWAKENING\n\nCommander Kara Voss had always been drawn to the impossible.\n\nIt started at age seven, when she decided to teach herself quantum mechanics from her father's old textbooks. At twelve, she built her first radio telescope from spare parts. At sixteen, she was accepted to MIT's Advanced Space Studies program...\n\n[Content continues - 250,000 words total]\n\nThank you for supporting independent authors! This novel would not exist without readers like you.\n\n— Bob Writer, 2247",
    category: "writing",
    pricingModel: "paid",
    priceCredits: 999,
    visibility: "public",
    media: [
      {
        url: "https://images.unsplash.com/photo-1507842620956-583a6da548bb?w=800&h=600&fit=crop",
        mimeType: "image/jpeg",
        size: 524288,
        width: 800,
        height: 600
      }
    ],
    tags: ["sci-fi", "novel", "fiction", "space", "adventure", "indie-publishing"],
    drmEnabled: true,
    drmConfig: {
      watermarkOpacity: 0.2,
      disableRightClick: true,
      disableTextSelect: true
    },
    metadata: {
      wordCount: 250000,
      pages: 856,
      format: "EPUB, MOBI, PDF",
      seriesIndex: 1,
      language: "English"
    },
    createdAt: new Date(Date.now() - 45*24*60*60*1000),
    updatedAt: new Date()
  }
]);

  {
    _id: "mongo_item_003",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    sqlId: "990e8400-e29b-41d4-a716-446655440003",
    title: "Writing Masterclass Bundle",
    description: "Complete course: Character development, plotting, world-building",
    script: "WRITING MASTERCLASS - Complete Bundle\n\nModule 1: Character Development (6 hours)\n- Creating compelling protagonists\n- Antagonist motivation deep-dive\n- Supporting cast dynamics\n- Character arcs that resonate\n- Dialogue techniques\n- Backstory and trauma\n\nModule 2: Plot Structure (8 hours)\n- Three-act structure\n- Hero's journey framework\n- Plot holes and solutions\n- Pacing and tension\n- Subplots and weaving narratives\n- Endings that satisfy\n\nModule 3: World-Building (5 hours)\n- Magic systems\n- Political structures\n- Social hierarchies\n- Economy and trade\n- Culture and language\n- Maps and geography\n\nModule 4: Advanced Techniques (7 hours)\n- Point of view mastery\n- Show vs. tell\n- Sensory details\n- Writing authentic emotions\n- Editing and self-critique\n- Publishing your work\n\nBONUS: Private Discord community with other writers!\n\nInstructor: Bob Writer (published author, 3 bestselling novels)\n\nCertificate of completion included.",
    category: "writing",
    pricingModel: "subscription",
    priceCredits: 1999,
    visibility: "public",
    media: [
      {
        url: "https://images.unsplash.com/photo-1516979187457-635ffe35ff15?w=800&h=600&fit=crop",
        mimeType: "image/jpeg",
        size: 524288,
        width: 800,
        height: 600
      }
    ],
    tags: ["writing", "course", "education", "masterclass", "storytelling", "craft"],
    drmEnabled: false,
    drmConfig: {
      watermarkOpacity: 0.1,
      disableRightClick: false,
      disableTextSelect: false
    },
    metadata: {
      totalHours: 26,
      videosIncluded: true,
      downloadableResources: true,
      certificateIncluded: true,
      accessDuration: "lifetime"
    },
    createdAt: new Date(Date.now() - 30*24*60*60*1000),
    updatedAt: new Date()
  },
  {
    _id: "mongo_item_004",
    userId: "550e8400-e29b-41d4-a716-446655440003",
    sqlId: "990e8400-e29b-41d4-a716-446655440004",
    title: "Web Dev Toolkit - 50 Code Snippets",
    description: "Ready-to-use React/Node.js snippets and utilities",
    script: "WEB DEVELOPER TOOLKIT - 50 Production-Ready Snippets\n\nReact Components (15 snippets):\n- useLocalStorage hook\n- useFetch hook with caching\n- usePagination hook\n- useDebounce hook\n- useClickOutside hook\n- useWindowSize hook\n- Modal component\n- Toast notification system\n- Dropdown menu\n- Infinite scroll\n- Image lazy loader\n- Form validation\n- Authentication wrapper\n- Loading skeleton\n- Error boundary\n\nNode.js / Express (15 snippets):\n- JWT authentication middleware\n- Error handling middleware\n- Async error wrapper\n- Rate limiter\n- CORS configuration\n- Winston logger setup\n- Database connection pool\n- Email service integration\n- File upload handler\n- Cache middleware\n- Input validation\n- Pagination helper\n- Response formatter\n- Environment config\n- API versioning\n\nUtilities (20 snippets):\n- Date formatting functions\n- String manipulation helpers\n- Array operations\n- Object utilities\n- Number formatting\n- URL parsing\n- Local storage helpers\n- API request builder\n- Error tracking setup\n- Performance monitoring\n- Analytics integration\n- Type guards\n- Debounce/throttle\n- Promise helpers\n- Regular expressions\n- Math utilities\n- Color converters\n- File operations\n- State management\n- Testing utilities\n\nALL CODE:\n- TypeScript ready\n- Well-documented\n- Production-tested\n- Copy-paste friendly\n- MIT licensed",
    category: "code",
    pricingModel: "paid",
    priceCredits: 1499,
    visibility: "public",
    media: [
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
        mimeType: "image/jpeg",
        size: 262144,
        width: 800,
        height: 600
      }
    ],
    tags: ["react", "nodejs", "code-snippets", "javascript", "web-development", "typescript"],
    drmEnabled: false,
    drmConfig: {
      watermarkOpacity: 0,
      disableRightClick: false,
      disableTextSelect: false
    },
    metadata: {
      snippetCount: 50,
      language: "TypeScript/JavaScript",
      frameworks: ["React", "Node.js", "Express"],
      license: "MIT",
      lastUpdated: "2024-01-15"
    },
    createdAt: new Date(Date.now() - 20*24*60*60*1000),
    updatedAt: new Date()
  },
  {
    _id: "mongo_item_005",
    userId: "550e8400-e29b-41d4-a716-446655440004",
    sqlId: "990e8400-e29b-41d4-a716-446655440005",
    title: "Ambient Music Production Pack",
    description: "Royalty-free loops and samples for ambient/downtempo production",
    script: "AMBIENT PRODUCTION PACK - Complete Collection\n\n📦 WHAT'S INCLUDED:\n\nSynth Loops (25 files):\n- Pad drones (30 seconds each)\n- Arpeggio sequences\n- Texture layers\n- Evolution sequences\n- Modulation sweeps\n\nField Recordings (15 files):\n- Rain sounds\n- Urban ambience\n- Forest ambience\n- Water sounds\n- Wind textures\n- Traffic ambience\n- Library/quiet space\n\nDrums & Percussion (20 files):\n- Soft glitch beats\n- Brushed drums\n- Ethnic percussion\n- Metallic hits\n- Foley percussion\n\nOne-Shots (30 files):\n- Bell tones\n- Pad hits\n- Texture shots\n- Atmospheric effects\n- Transitions\n\n🎵 SPECS:\n- 24-bit / 96kHz WAV files\n- Royalty-free (commercial license included)\n- Compatible with all DAWs\n- Organized by BPM (70-100 BPM range)\n- Total: 2.5 GB\n\n✅ USAGE RIGHTS:\n✓ Commercial projects\n✓ Film/TV\n✓ Games\n✓ YouTube\n✓ Podcasts\n✓ Streaming platforms\n✓ Remixes allowed\n\nBONUS: Production tips guide included!",
    category: "audio",
    pricingModel: "free",
    priceCredits: 0,
    visibility: "public",
    media: [
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
        mimeType: "image/jpeg",
        size: 393216,
        width: 800,
        height: 600
      }
    ],
    tags: ["music", "ambient", "loops", "samples", "production", "royalty-free"],
    drmEnabled: false,
    drmConfig: {
      watermarkOpacity: 0,
      disableRightClick: false,
      disableTextSelect: false
    },
    metadata: {
      fileCount: 90,
      totalSize: "2.5 GB",
      audioFormat: "WAV",
      bitDepth: "24-bit",
      sampleRate: "96kHz",
      license: "Royalty-free commercial"
    },
    createdAt: new Date(Date.now() - 15*24*60*60*1000),
    updatedAt: new Date()
  }
]);

// ==================== CONVERSATIONS & MESSAGES ====================
db.conversations.insertMany([
  {
    _id: ObjectId(),
    type: "direct",
    participants: ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"],
    admins: [],
    name: null,
    description: null,
    avatar: null,
    lastMessageAt: new Date(Date.now() - 2*60*60*1000),
    unreadBy: [],
    createdBy: "550e8400-e29b-41d4-a716-446655440001",
    isArchived: false,
    createdAt: new Date(Date.now() - 30*24*60*60*1000),
    updatedAt: new Date()
  }
]);

db.messages.insertMany([
  {
    _id: ObjectId(),
    conversationId: "direct_alice_bob",
    senderId: "550e8400-e29b-41d4-a716-446655440001",
    content: "Hey Bob! Love your latest chapter. Can't wait for more!",
    type: "text",
    attachments: [],
    readBy: ["550e8400-e29b-41d4-a716-446655440002"],
    editedAt: null,
    isDeleted: false,
    replyTo: null,
    timestamp: new Date(Date.now() - 3*60*60*1000),
    createdAt: new Date(Date.now() - 3*60*60*1000),
    updatedAt: new Date(Date.now() - 3*60*60*1000)
  },
  {
    _id: ObjectId(),
    conversationId: "direct_alice_bob",
    senderId: "550e8400-e29b-41d4-a716-446655440002",
    content: "Thanks Alice! Working on chapter 2 now. Should have it ready next week!",
    type: "text",
    attachments: [],
    readBy: ["550e8400-e29b-41d4-a716-446655440001"],
    editedAt: null,
    isDeleted: false,
    replyTo: null,
    timestamp: new Date(Date.now() - 2*60*60*1000),
    createdAt: new Date(Date.now() - 2*60*60*1000),
    updatedAt: new Date(Date.now() - 2*60*60*1000)
  }
]);

// ==================== TRANSACTIONS ====================
db.transactions.insertMany([
  {
    _id: ObjectId(),
    userId: "550e8400-e29b-41d4-a716-446655440001",
    sessionId: "stripe_session_alice_001",
    stripePaymentIntentId: "pi_alice_1001",
    amount: 29.99,
    type: "purchase",
    status: "completed",
    metadata: {
      itemId: "mongo_item_001",
      itemTitle: "Urban Landscape Digital Art Pack"
    },
    createdAt: new Date(Date.now() - 5*24*60*60*1000),
    updatedAt: new Date(Date.now() - 5*24*60*60*1000)
  },
  {
    _id: ObjectId(),
    userId: "550e8400-e29b-41d4-a716-446655440003",
    sessionId: "stripe_session_charlie_001",
    stripePaymentIntentId: "pi_charlie_1001",
    amount: 14.99,
    type: "purchase",
    status: "completed",
    metadata: {
      itemId: "mongo_item_004",
      itemTitle: "Web Dev Toolkit - 50 Code Snippets"
    },
    createdAt: new Date(Date.now() - 8*24*60*60*1000),
    updatedAt: new Date(Date.now() - 8*24*60*60*1000)
  }
]);

print("✅ MongoDB collections seeded successfully!");
print("   Users: 4");
print("   Posts: 5");
print("   Items: 5");
print("   Messages: 2");
print("   Transactions: 2");
