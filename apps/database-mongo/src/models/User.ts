import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: String,
    email: String,
    name: String,
    avatar: String,
    
    // Profile Information
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    socialLinks: [{ type: String }],
    
    // Wallet & Credits
    credits: {
      type: Number,
      default: 0,
    },
    totalEarned: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    
    // User's library (purchased items)
    library: [
      {
        itemId: { type: String, required: true },
        purchaseDate: { type: Date, default: Date.now },
        price: { type: Number, required: true },
        status: { type: String, enum: ['purchased', 'processing'], default: 'purchased' },
        accessLevel: { type: String, enum: ['full', 'limited'], default: 'full' },
        metadata: { type: mongoose.Schema.Types.Mixed },
      }
    ],
    
    // Privacy & Account Settings
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      showEmail: { type: Boolean, default: false },
      allowMessages: { type: Boolean, default: true },
      allowNotifications: { type: Boolean, default: true },
      showOnlineStatus: { type: Boolean, default: true },
      showActivityStatus: { type: Boolean, default: true },
    },
    
    // Notification preferences
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      frequency: { type: String, enum: ['realtime', 'daily', 'weekly'], default: 'realtime' },
      quietHoursStart: { type: String, default: '22:00' },
      quietHoursEnd: { type: String, default: '08:00' },
      types: {
        newFollowers: { type: Boolean, default: true },
        itemPurchases: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        liveStreams: { type: Boolean, default: true },
      },
    },
    
    // Social connections
    followers: [{ type: String }],
    following: [{ type: String }],
    blockedUsers: [{ type: String }],
    
    // Connected services
    connectedServices: {
      metaAccounts: [{ type: String }],
      web3Wallets: [{ type: String }],
    },
    
    // Account status
    accountStatus: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
    lastLoginAt: { type: Date },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'library.itemId': 1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
