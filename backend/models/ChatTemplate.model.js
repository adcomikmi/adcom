// backend/models/ChatTemplate.model.js
import { Schema, model } from 'mongoose';

const chatTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ChatTemplate = model('ChatTemplate', chatTemplateSchema);
export default ChatTemplate;