const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartySchema = new Schema({
  event_name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  theme: {
    type: String,
  },
  state: {
    type: Number,
    min: 0,
    max: 2,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Relation avec la table Users
    },
  ],

  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "songs", // Relation avec la table Songs
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = Party = mongoose.model("parties", PartySchema);
