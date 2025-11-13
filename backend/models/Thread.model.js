// backend/models/Thread.model.js
import { Schema, model } from 'mongoose';

const threadSchema = new Schema(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    konten: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'authorModel',
    },
    authorModel: {
      type: String,
      required: true,
      enum: ['User', 'Admin'],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
      }
    ]
  },
  {
    timestamps: true,
  },
);

const Thread = model('Thread', threadSchema);
export default Thread;