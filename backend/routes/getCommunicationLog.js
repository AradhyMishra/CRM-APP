const express = require("express");
const router = express.Router();
const Communicationlogs = require("../models/CommunicationLog");
const Segment = require('../models/Segment')

router.get('/getSegmentCustomers/:segmentId', async (req, res) => {
    try {
        const { segmentId } = req.params;
        const segment = await Segment.findById(segmentId).populate('customerIds');
        if (!segment) return res.status(404).json({ message: 'Segment not found' });

        res.json({ customers: segment.customerIds });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customers in this segment' });
    }
});

router.post('/getCampaignsForCustomers', async (req, res) => {
    try {
        const { customerIds } = req.body;
        const campaigns = await Communicationlogs.find({ customerId: { $in: customerIds } }).populate('customerId');
        res.json({ campaigns });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching campaigns for customers' });
    }
});


module.exports = router;
