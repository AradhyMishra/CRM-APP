const express = require("express");
const router = express.Router();
const { producer } = require("../kafkaConfig");
const Campaign = require("../models/Campaign");
const CommunicationLog = require("../models/CommunicationLog");
const Customer = require("../models/Customer");
const Segment = require("../models/Segment");

router.post('/sendCampaign', async (req, res) => {
    try {
        const { segmentId, messageTemplate } = req.body;

        if (!segmentId) {
            return res.status(400).json({ message: 'segmentId is required' });
        }

        const segment = await Segment.findById(segmentId);
        if (!segment) {
            return res.status(404).json({ message: 'Segment not found' });
        }

        const customers = await Customer.find({ _id: { $in: segment.customerIds } });
        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found for this segment' });
        }

        const campaign = await Campaign.create({
            segmentId: segment._id,
            message: messageTemplate
        });

        // Create and store logs in the database
        const logs = [];
        for (const customer of customers) {
            const personalizedMessage = messageTemplate.replace("[Name]", customer.name); //replace [Name] with the original customer name, which needs to be send to campaign
            const status = Math.random() < 0.9 ? 'SENT' : 'FAILED'; //assigning status of messsage randomly

            const log = await CommunicationLog.create({
                campaignId: campaign._id,
                segmentId: segment._id,
                customerId: customer._id,
                message: personalizedMessage,
                status
            });
            logs.push(log);
        }

        // Publish logs to Kafka
        for (const log of logs) {
            await producer.send({
                topic: 'campaigns-topic',
                messages: [
                    { value: JSON.stringify({ logId: log._id, status: log.status }) }
                ]
            });
        }

        res.status(200).json({ message: "Campaign sent to Kafka topic successfully" });
    } catch (error) {
        console.error('Error sending messages:', error);
        res.status(500).json({ message: 'Error sending messages', error: error.message });
    }
});

module.exports = router;
