import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    // Identifiers
    userId: { type: String, required: true, index: true }, // Who made the transaction
    type: {
      type: String,
      enum: ['purchase', 'income', 'top-up', 'refund', 'adjustment'],
      required: true,
      index: true,
    },
    
    // Amount
    amount: { type: Number, required: true, min: 0 },
    credits: { type: Number, required: true, min: 0 }, // Number of credits
    
    // Related items
    relatedId: { type: String }, // itemId, postId, or partnerId
    relatedType: {
      type: String,
      enum: ['item', 'post', 'creator', 'platform'],
    },
    
    // Payment info
    paymentMethod: {
      type: String,
      enum: ['stripe', 'wallet', 'referral', 'admin'],
      default: 'stripe',
    },
    stripeSessionId: { type: String },
    stripeTransactionId: { type: String },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    
    // Metadata
    description: { type: String, maxlength: 500 },
    metadata: { type: mongoose.Schema.Types.Mixed },
    
    // For income transactions
    earnedFrom: { type: String }, // userId of purchaser (if applicable)
    
    // Tax & fees
    platformFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for queries
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ stripeSessionId: 1 });
TransactionSchema.index({ relatedId: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
