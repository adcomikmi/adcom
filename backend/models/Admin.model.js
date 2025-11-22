// backend/models/Admin.model.js
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    nama: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: '/default-admin-profile.png',
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  },
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = model('Admin', adminSchema);
export default Admin;