// backend/models/MateriTugas.model.js
import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
  originalName: { type: String, required: true },
  googleFileId: { type: String, required: true }, // ID File di Google Drive
  mimeType: { type: String, required: true },
  webViewLink: { type: String } // Link untuk view di browser (opsional)
});

const materiTugasSchema = new Schema(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    tipe: {
      type: String,
      required: true,
      enum: ['materi', 'tugas'],
    },
    files: [fileSchema],
    deadline: {
      type: Date,
      default: null,
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

const MateriTugas = model('MateriTugas', materiTugasSchema);
export default MateriTugas;