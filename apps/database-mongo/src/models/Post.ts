import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const MediaSchema = new mongoose.Schema({
    type: { type: String },
    url: { type: String },
    alt: { type: String },
});

const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    sqlId: { type: String, index: true }, // PostgreSQL UUID for direct lookup
    title: { type: String, maxlength: 200 },
    content: { type: String, required: true, maxlength: 5000 },
    media: [MediaSchema],
    visibility: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
    
    // Engagement
    likes: [{ type: String, index: true }], // Array of user IDs who liked
    comments: [CommentSchema],
    shares: { type: Number, default: 0 },
    saves: [{ type: String }], // Array of user IDs who saved
    
    // Metadata
    category: { type: String, default: 'general' },
    tags: [{ type: String }],
    
    // Algorithm tracking
    engagementScore: { type: Number, default: 0 }, // Updated based on likes, comments, shares
    isSponsored: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
});

// Add indexes for queries
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ likes: 1 });
PostSchema.index({ engagementScore: -1 });
PostSchema.index({ category: 1, createdAt: -1 });

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
