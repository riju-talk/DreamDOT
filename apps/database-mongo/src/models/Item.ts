import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    sqlId: { type: String, index: true }, // PostgreSQL UUID for direct lookup
    title: { type: String, required: true, trim: true, maxlength: 140, index: true },
    description: { type: String, trim: true, maxlength: 5000 },
    category: {
      type: String,
      enum: [
        'writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template', 'other',
        'art', 'photography', 'animation', 'music', '3d', 'education',
      ],
      default: 'other',
      index: true,
    },
    price: { 
      type: Number, 
      required: true,
      min: 0,
      index: true,
    },
    visibility: {
      type: String,
      enum: ['private', 'unlisted', 'public'],
      default: 'private',
      index: true,
    },
    media: [
      {
        url: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number },
        width: { type: Number },
        height: { type: Number },
      },
    ],
    
    // Engagement & Marketplace Tracking
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    purchases: [
      {
        buyerId: { type: String, required: true },
        purchaseDate: { type: Date, default: Date.now },
        transactionId: { type: String },
      }
    ],
    
    // Metadata
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    
    // DRM & Rights
    drm: {
      enabled: { type: Boolean, default: true },
      watermark: { type: Boolean, default: true },
      tracking: { type: Boolean, default: true },
    },
    
    // Monetization
    monetizationType: {
      type: String,
      enum: ['one-time', 'subscription', 'free'],
      default: 'one-time',
    },
    
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Add indexes for marketplace performance
ItemSchema.index({ createdAt: -1 });
ItemSchema.index({ userId: 1, createdAt: -1 });
ItemSchema.index({ category: 1, price: 1 });
ItemSchema.index({ rating: -1, sales: -1 });
ItemSchema.index({ featured: 1, createdAt: -1 });
ItemSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index

export const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
