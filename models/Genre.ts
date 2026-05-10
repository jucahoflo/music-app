import mongoose from 'mongoose';

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Genre || mongoose.model('Genre', GenreSchema);
