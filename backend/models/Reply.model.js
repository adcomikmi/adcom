// backend/models/Reply.model.js
import { Schema, model } from 'mongoose';

const replySchema = new Schema(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
    },
    parentReplyId: {
      type: Schema.Types.ObjectId,
      ref: 'Reply',
      default: null,
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

const Reply = model('Reply', replySchema);
export default Reply;