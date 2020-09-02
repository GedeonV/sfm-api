const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  artist: {
    type: String,
  },
  album: {
    type: String,
  },
  date: {
    type: String,
  },
  style: {
    type: String,
  },
  path: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = Song = mongoose.model("songs", SongSchema);
