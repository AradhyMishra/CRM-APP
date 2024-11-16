const mongoose = require("mongoose");

const commLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Campaign" }, // Reference to Campaign _id
    segmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Segment" }, // Reference to Segment _id
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
    sentAt: { type: Date, default: Date.now },
});

const CommunicationLog = mongoose.model("CommunicationLog", commLogSchema);
module.exports = CommunicationLog;
