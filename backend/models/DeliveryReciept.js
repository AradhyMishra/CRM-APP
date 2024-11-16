const mongoose = require("mongoose");

const DeliveryReceiptSchema = new mongoose.Schema({
    logId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunicationLog', required: true },
    status: { type: String, enum: ['SENT', 'FAILED'], required: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryReceipt', DeliveryReceiptSchema);