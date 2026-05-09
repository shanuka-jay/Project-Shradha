const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    state: { type: String, required: true },
    region: { type: String },
    address: { type: String },
    chiefMonk: { type: String },
    contact: { type: String },
    email: { type: String },
    description: { type: String },
    history: { type: String },
    imageUrl: { type: String },
    gallery: [{ type: String }],
    monkImage: { type: String },
    lat: { type: Number },
    lng: { type: Number },
});

module.exports = mongoose.model('Temple', TempleSchema);
