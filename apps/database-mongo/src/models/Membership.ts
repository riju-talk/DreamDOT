import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

membershipSchema.index({ conversationId: 1, userId: 1 }, { unique: true });
export const Membership = mongoose.models.Membership || mongoose.model('Membership', membershipSchema);
