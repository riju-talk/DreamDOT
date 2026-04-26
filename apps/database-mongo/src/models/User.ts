import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: String,
    email: String,
    name: String,
    avatar: String,
    credits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
