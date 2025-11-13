// backend/models/Submission.model.js
import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
  originalName: { type: String, required: true },
  path: { type: String, required: true },
});

const submissionSchema = new Schema(
  {
    tugasId: {
      type: Schema.Types.ObjectId,
      ref: 'MateriTugas',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    files: [fileSchema], 
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({ tugasId: 1, userId: 1 });

const Submission = model('Submission', submissionSchema);
export default Submission;