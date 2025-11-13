// backend/models/MateriTugas.model.js
import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
  originalName: { type: String, required: true },
  path: { type: String, required: true },
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