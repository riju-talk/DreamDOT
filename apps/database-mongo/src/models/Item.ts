import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 5000 },
    category: {
      type: String,
      enum: ['writing', 'illustration', 'audio', 'video', 'research', 'other'],
      default: 'other',
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
    tags: [{ type: String, trim: true }],
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

ItemSchema.index({ createdAt: -1 });

export const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
