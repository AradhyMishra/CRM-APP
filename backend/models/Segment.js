const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
    segmentId: { type: String, required: true, unique: true }, // Manually generated ID
    name: { type: String, required: true },
    conditions: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    audienceSize: { type: Number, required: true },
    customerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }]
});

const Segment = mongoose.model('Segment', segmentSchema);
module.exports = Segment;
