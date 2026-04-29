const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String },
  history: { type: String },
  images: [{ type: String }],
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
