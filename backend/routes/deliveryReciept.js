const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const DeliveryReceipt = require('../models/DeliveryReciept');
const CommunicationLog = require("../models/CommunicationLog");

router.post('/deliveryReciept', async (req, res) => {
    try {
        const { logId, status } = req.body;

        if (!logId || !status) {
            return res.status(400).json({ message: 'logId and status are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(logId)) {
            return res.status(400).json({ message: 'Invalid logId format' });
        }

        const objectId = new mongoose.Types.ObjectId(logId);

        // Update CommunicationLog
        const logEntry = await CommunicationLog.findByIdAndUpdate(
            objectId,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!logEntry) {
            return res.status(404).json({ message: 'Communication log not found' });
        }

        // Save DeliveryReceipt
        const receipt = await DeliveryReceipt.create({
            logId: objectId,
            status,
            updatedAt: Date.now()
        });

        res.status(200).json({ message: 'Delivery status updated successfully', receipt });
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ message: 'Error updating delivery status', error: error.message });
    }
});

module.exports = router;
