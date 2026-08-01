import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: String,
    email: String,
    name: String,
    avatar: String,
    
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
    },
    
    // Social connections
    followers: [{ type: String }],
    following: [{ type: String }],
    
    // Account status
    accountStatus: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
    lastLoginAt: { type: Date },
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

export const User = mongoose.models.User || mongoose.model('User', userSchema);
