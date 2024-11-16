const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    segmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Segment" }, // Use ObjectId to reference Segment _id
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
