Here is the definitive, fully polished, **"Bring It Home" Edition** of the DreamDOT Product Requirements Document. It explicitly and comprehensively locks in DreamDOT as a **Social Media + Content Monetization Platform**, integrating the exact chat, studio, and creation constraints you specified.

---

# 📘 DreamDOT — Master Product Requirements Document (PRD) v4.0
**"The Bring It Home Edition: Social Media + Content Monetization Platform"**

| | |
|---|---|
| **Document version** | 4.0 (Final Polish) |
| **Status** | Locked & Approved for Development |
| **Core Identity** | **Social Media Network + DRM-Protected Digital Content Marketplace** |
| **Last updated** | 2026-08-01 |
| **Owner** | Rijusmit |
| **Repository** | `C:\Code\01_full_stack\DreamDot` |

---

## 1. Overview & Core Identity
**DreamDOT** is a unified **Social Media and Content Monetization Platform** built for the modern creator economy. It is the single destination where creators build an audience through a native social feed, collaborate in real-time text communities, and monetize their digital assets (blogs, comics, videos, courses, art) in a secure, DRM-protected marketplace.

**The Core Pillars:**
1. **Social Media Engine:** A rich, algorithmic, and chronological feed where creators post updates, stories, and content to build their personal brand and "micro-celebrity" status.
2. **Dual-Studio Workspace:** 
   - **Creator Studio:** A streamlined, 3-part workspace (Writer, Media, Bundle) with a minimal rich-text editor and mandatory metadata (Title, Thumbnail, Script) for all assets.
   - **Ad Studio:** A centralized hub to customize and broadcast organic stories or paid ad campaigns directly to Instagram and Facebook.
3. **The DRM-Protected Marketplace ("The Vault"):** Purchased digital items can *only* be viewed inside DreamDOT. Screenshots and screen recordings are forbidden via dynamic forensic watermarking and OS-level blocking to maintain absolute integrity and scarcity.
4. **Text-Only Community Hubs:** Discord-style servers composed **entirely of text channels** (no voice channels), featuring "Live" presence indicators so users know exactly when creators or collaborators are online and available to chat.
5. **Web3 Integrity Engine:** Backed by blockchain technology to maintain an immutable ledger of all purchases, creative ownership, and the in-app credit economy. **No censorship, pure creativity.**

---

## 2. Problem Statement
Creators today are forced to stitch together fragmented tools: Instagram for social reach, Patreon for subscriptions, Gumroad for marketplaces, and Discord for community. 
* **Marketing Friction:** Creators waste hours manually cross-posting stories and setting up external ad managers to promote their work.
* **Creation Friction:** Existing tools are either too complex or lack structured workflows for packaging digital goods (scripts, media, bundles).
* **Piracy:** Digital items are easily screenshot and redistributed, destroying value.
* **Siloed, Noisy Communities:** Voice channels are often unused or overwhelming. Creators need focused, text-based collaboration spaces with clear "Live/Online" availability indicators.
* **Platform Censorship:** Centralized platforms arbitrarily ban creators or demonetize content.

**DreamDOT solves this** by being the single source of truth for a creator's social presence, structured creation workflow, community, and commerce.

---

## 3. Product Goals
| Goal | Description |
| :--- | :--- |
| **G1. True Social Media Presence** | Provide a rich feed, stories, and user profiles that rival mainstream social networks, driving organic discovery. |
| **G2. Frictionless Meta Broadcasting** | Allow creators to link IG/FB and push organic stories or launch **paid ad campaigns** directly from the DreamDOT Ad Studio. |
| **G3. Streamlined Creator Studio** | Enforce a strict, 3-part creation workflow (Writer, Media, Bundle) with mandatory Title, Thumbnail, and Script for *every* asset, powered by a minimal, fast rich-text editor. |
| **G4. Anti-Piracy DRM Marketplace** | Enable the sale of digital items that can *only* be viewed inside the DreamDOT "Vault" viewer, blocking screenshots and applying user-specific watermarks. |
| **G5. Focused Text-Only Communities** | Foster collaboration via Discord-style servers with **text channels only** (no voice), augmented by "Live" presence indicators to show real-time availability. |
| **G6. Pure Credit Economy & Web3** | Handle all marketplace transactions, subscriptions, and ad-spend using an internal Credit System, anchored by blockchain for transparent, uncensorable ownership. |

---

## 4. Target Audience & Personas
* **Persona A: "The Micro-Celebrity Creator"** - Wants to build a personal brand. Posts daily stories, broadcasts ads to IG/FB to drive traffic, uses the Creator Studio to package comics/courses, and hosts text-only community servers for top fans.
* **Persona B: "The Digital Collector / Fan"** - Follows creators on the feed, buys their assets using credits, views them securely in their Library Dashboard, and joins text channels to chat when the creator is "Live".
* **Persona C: "The Collaborator"** - Uses the "Bundle" feature to group assets and joins text-only servers to find artists, writers, and devs to build projects with, relying on "Live" indicators to know when to reach out.

---

## 5. User Stories

### 5.1 Social Media & Broadcasting
* As a creator, I have a **Profile Page** that acts as my social hub (bio, followers, feed, marketplace items).
* As a creator, I can link my Instagram and Facebook accounts via OAuth.
* As a creator, I can write a Story/Post on DreamDOT and click **"Broadcast to Meta"** to instantly publish it to my IG/FB Stories.
* As a creator, I can use the **Ad Studio** to select a post, set a budget (in Credits), define an audience, and launch a native Meta Ad Campaign without leaving the app.

### 5.2 The Creator Studio (Strict Workflow)
* As a creator, when I create a new digital asset, I am guided through a **3-Part Creator Studio**:
  1. **Writer’s Part:** A minimal, fast rich-text editor for blogs, scripts, and descriptions.
  2. **Media Part:** A dedicated zone to upload and arrange images, videos, audio, or files.
  3. **Bundle Part:** A tool to select *existing* assets from my library and group them into a single, discounted, sellable bundle.
* As a creator, the system **will not let me publish** unless I have provided a **Title**, a **Thumbnail**, and a **Script** (or text body), regardless of whether the asset is a video, comic, or blog.

### 5.3 The Marketplace & DRM "Vault"
* As a creator, I can list digital items as **Free, Paid (one-time), Subscription (tiered), or Bundled**.
* As a fan, I can purchase an item using Credits. It immediately appears in my **Library Dashboard**.
* As a fan, when I open a purchased item, it loads in the **Vault Viewer**. Right-clicking, text selection, and DevTools are disabled, and a dynamic watermark with my User ID is overlaid.

### 5.4 Community & Live Presence
* As a user, I can join or create **Servers** (Discord-style) that contain **text channels only** (no voice channels).
* As a user, I can see a **"Live" indicator** (e.g., a green dot or "Currently Active" badge) next to a creator's or friend's name, letting me know they are online and available to chat.
* As a user, I can send text, image, and file messages in these channels with typing indicators and read receipts.

### 5.5 Economy & Web3
* As a user, I manage my **Wallet Dashboard**, viewing my Credit balance, transaction history, and blockchain-verified ownership receipts.
* As a creator, I can "Mint" my item on the blockchain to generate an immutable certificate of authenticity and secure my royalty splits.

---

## 6. Functional Requirements

### 6.1 Dashboards & Navigation
* **FR-1.1 Main Feed Dashboard:** Infinite scroll, stories carousel, trending creators, and algorithmic/chronological toggles.
* **FR-1.2 Marketplace Dashboard:** E-commerce grid for digital assets. Filters for Media Type, Price (Credits), and Bundles.
* **FR-1.3 Wallet Dashboard:** Credit balance, ledger history, Web3 wallet connection, and subscription management.
* **FR-1.4 Library Dashboard:** The secure gateway to all purchased DRM-protected content.

### 6.2 The Dual-Studio Workspace
* **FR-2.1 Creator Studio - Mandatory Fields:** The publish button is disabled until `title`, `thumbnail_url`, and `script` (or main text body) are populated, regardless of the `itemType`.
* **FR-2.2 Creator Studio - Writer’s Part:** Integrates a minimal, lightweight rich-text editor (e.g., Quill or stripped-down Tiptap) optimized for speed and clean blog/script writing.
* **FR-2.3 Creator Studio - Media Part:** Drag-and-drop zone for uploading media, enforcing 50MB caps and MIME validation via ImageKit.
* **FR-2.4 Creator Studio - Bundle Part:** A UI to search and select multiple previously published `Item` IDs, group them, and assign a new bundled `priceCredits`.
* **FR-2.5 Ad Studio:** UI to connect Meta accounts, select a DreamDOT post, set a credit budget, define target demographics, and push to Meta Ads Manager via the Marketing API.

### 6.3 The "Vault" DRM Viewer
* **FR-3.1 Secure Rendering:** Content is rendered inside a sandboxed `<iframe>` or `<canvas>`.
* **FR-3.2 Anti-Piracy Hooks:** JS listeners disable `contextmenu` (right-click), `keydown` (PrintScreen), and `selectstart` (text highlighting).
* **FR-3.3 Forensic Watermarking:** CSS/Canvas overlays a repeating, semi-transparent grid of the viewer's `User ID` and `Session Timestamp` over images and comics.
* **FR-3.4 Video DRM:** HTML5 Encrypted Media Extensions (EME) used for video playback to prevent stream ripping.

### 6.4 Community: Text-Only Servers & Live Presence
* **FR-4.1 Server Architecture:** Servers contain channels with `type: 'text'` **only**. Voice channel creation is explicitly disabled at the schema and UI level.
* **FR-4.2 Live Presence:** Socket.IO emits `presence:join` and `presence:leave` events. The UI displays a "Live" or "Online" indicator next to user avatars in the server member list and DM sidebar.
* **FR-4.3 Messaging:** Supports text, images, and file attachments with typing indicators and read receipts.

### 6.5 Monetization & Web3
* **FR-5.1 Closed-Loop Credits:** All platform transactions (buying items, funding ads, tipping) use internal Credits.
* **FR-5.2 Content Minting:** Option to mint an Item as an NFT (ERC-721/1155) on an L2 (Polygon/Base) to prove origin.
* **FR-5.3 Account Abstraction (ERC-4337):** Users interact via "Credits" and email/social login. Gas fees are abstracted via Paymasters so users never see MetaMask prompts.

---

## 7. Non-Functional Requirements
| Category | Requirement |
| :--- | :--- |
| **Performance** | Creator Studio rich-text editor must load in <100ms. Feed and Marketplace must load in <1.5s. |
| **Security & DRM** | Dynamic watermarking must render at <16ms to avoid UI lag. Web3 private keys must never touch the backend. Strict zero-tolerance automated hashing (PhotoDNA) for illegal content. |
| **Reliability** | Idempotent Stripe webhook handling; cached/shared DB connections; Socket.IO exponential backoff for presence events. |
| **Usability** | Mobile-first responsive design. The 3-part Creator Studio must be intuitive and enforce the mandatory fields gracefully without frustrating the user. |

---

## 8. Technical Architecture Updates

```text
                       ┌─────────────────────────────────────────────────┐
                       │            apps/web (Next.js 15 App Router)     │
                       │  Feed · Market · Wallet · Library · Vault(DRM)  │
                       │  Ad Studio · Creator Studio (Writer/Media/Bundle)│
                       │  Text Servers · Live Presence · Profile · Auth  │
                       └──────┬──────────────┬──────────────┬────────────┘
                              │              │              │
              REST + Socket.IO│   REST/JWT   │  Meta APIs   │  Web3/RPC
                              ▼              ▼              ▼              ▼
                     ┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────┐
                     │  apps/chat   │ │ apps/payment │ │ apps/meta  │ │ apps/web3    │
                     │  Express+IO  │ │  Express     │ │  Express   │ │  Node/JS     │
                     │  (Text Only) │ │  (Credits)   │ │  (Ads)     │ │  (Minting)   │
                     └──────┬───────┘ └───────┬──────┘ └─────┬──────┘ └──────┬───────┘
                            │                 │              │               │
                            └────────┬────────┴──────────────┴───────────────┘
                                     ▼
                      ┌──────────────────────────────────────┐
                      │      Hybrid Database & Indexing      │
                      │  PostgreSQL (Prisma): Users, Social, │
                      │  AdCampaigns, MetaIntegrations.      │
                      │  MongoDB (Mongoose): Items (with     │
                      │  mandatory script/thumbnail), Chat,  │
                      │  Text Channels, Transactions.        │
                      │  Redis: Caching, Socket.IO Pub/Sub,  │
                      │  Live Presence state.                │
                      └──────────────────────────────────────┘
```

---

## 9. Data Model Extensions (Critical Updates)

### 9.1 MongoDB: Item Schema (Enforcing Creator Studio Rules)
```javascript
const ItemSchema = new Schema({
  userId: { type: String, required: true, index: true },
  
  // MANDATORY FIELDS (Enforced at API and UI level)
  title: { type: String, required: true, trim: true, maxlength: 140 },
  thumbnailUrl: { type: String, required: true }, 
  script: { type: String, required: true }, // The core text body/script, regardless of media type
  
  category: { type: String, enum: ['blog', 'comic', 'video', 'audio', 'code', 'art', 'bundle', 'other'], required: true },
  pricingModel: { type: String, enum: ['free', 'paid', 'subscription', 'bundle'], default: 'free' },
  priceCredits: { type: Number, default: 0 },
  
  // Bundle Specifics
  bundleItems: [{ type: Schema.Types.ObjectId, ref: 'Item' }], // Populated only if category === 'bundle'
  
  // DRM & Web3
  blockchainTokenId: { type: String, sparse: true },
  drmEnabled: { type: Boolean, default: true },
  
  media: [{
    url: String,
    mimeType: String,
    size: Number
  }],
  
  visibility: { type: String, enum: ['private', 'unlisted', 'public'], default: 'private' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

### 9.2 MongoDB: Channel Schema (Text-Only Enforcement)
```javascript
const ChannelSchema = new Schema({
  serverId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  // STRICTLY TEXT. No 'voice' or 'stage' enum values allowed.
  type: { type: String, enum: ['text'], default: 'text' }, 
  topic: { type: String, maxlength: 255 },
  position: { type: Number, default: 0 }
}, { timestamps: true });
```

---

## 10. Acceptance Criteria (MVP "Bring It Home")
1. **Creator Studio Enforcement:** A creator *cannot* click "Publish" in the Creator Studio unless the Title, Thumbnail, and Script fields are filled. The UI clearly separates the Writer, Media, and Bundle tabs.
2. **Bundle Functionality:** A creator can successfully select 2+ existing items, group them in the Bundle Part, and publish them as a single sellable asset with a unified credit price.
3. **Text-Only Chat:** A user can create a server and add channels. The UI and API explicitly prevent the creation or joining of voice channels. 
4. **Live Presence:** When a user opens the app, their contacts see a "Live/Online" indicator in the server member list or DM sidebar within 2 seconds via Socket.IO.
5. **DRM Vault:** A purchased comic loads in the Library. Right-click is disabled, and a dynamic watermark with the viewer's User ID is visibly overlaid on the canvas.
6. **Ad Studio:** A creator can link an IG account, select a feed post, allocate 100 Credits, and successfully trigger the Meta API to create an ad campaign.

---

## 11. Known Risks & Mitigations
| Risk | Mitigation |
| :--- | :--- |
| **OS-Level Screen Recording** | Browsers cannot block OBS/native screen recorders. **Mitigation:** Forensic dynamic watermarking ensures any leaked content can be traced back to the specific user's account for immediate banning and legal action. |
| **Creator Studio Friction** | Mandatory fields (Title, Thumbnail, Script) might annoy creators making simple posts. **Mitigation:** Provide smart defaults (e.g., auto-generate thumbnail from first media frame, auto-fill script with "No script provided" for pure media drops, though a custom script is still required to proceed). |
| **Meta API Rate Limits** | Implement strict exponential backoff and queueing in the `apps/meta` microservice. |
| **"No Censorship" Liability** | "No censorship" applies to ideology and art. **Strict zero-tolerance** automated hashing (PhotoDNA) must run on all uploads to block illegal content (CSAM, terrorism) to comply with international law. |

---

## 12. Out of Scope (for V1)
* **Voice or Video Chat Channels:** Explicitly excluded. Community interaction is text, image, and file-based only, with "Live" text presence.
* **Native iOS/Android Apps:** Web PWA only for now.
* **Fiat-to-Crypto On-Ramps:** Internal credit system only for V1 (Stripe is for credit top-ups, not direct fiat-to-creator payouts yet).
* **Complex Algorithmic Feed Manipulation:** V1 is strictly chronological/following-based + trending.

---
*“Empowering creators to own their art, their audience, and their voice. Uncensored. Unstoppable. Bring it home.”*