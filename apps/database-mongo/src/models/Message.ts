import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 4000,
    },
    ciphertext: {
      type: String,
    },
    nonce: {
      type: String,
    },
    keyId: {
      type: String,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'audio', 'video', 'system'],
      default: 'text',
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        size: {
          type: Number,
        },
      },
    ],
    readBy: [{ type: String }],
    editedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ readBy: 1 });

messageSchema.virtual('isRead').get(function () {
  return this.readBy.length > 0;
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
