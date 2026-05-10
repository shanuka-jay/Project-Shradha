const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String },
  chiefMonk: { type: String },
  phone: { type: String },
  email: { type: String },
  overview: { type: String },
  history: { type: String },
  mainImage: { type: String },
  chiefMonkImage: { type: String },
  galleryImages: [{ type: String }],
  images: [{ type: String }],
  services: [{ type: String }],
  lat: { type: Number },
  lng: { type: Number },
  status: { type: String, default: 'published' },
  mapVisible: { type: Boolean, default: true },
  regionTag: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema, 'Temple');
