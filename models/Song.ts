import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: String },
  mp3FileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  pdfFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  genreId: { type: String, required: true },
  playCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Song || mongoose.model('Song', SongSchema);
