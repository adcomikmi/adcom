// backend/models/Feedback.model.js
import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Feedback = model('Feedback', feedbackSchema);
export default Feedback;