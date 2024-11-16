const express = require('express');
const router = express.Router();
const { producer } = require('../kafkaConfig');
const Customer = require('../models/Customer'); 

router.post('/order', async (req, res) => {
    const orderData = req.body;

    
    if (!orderData.customerId) {
        return res.status(400).send('Customer ID is required');
    }

    try {
        // Send order data to Kafka topic
        await producer.send({
            topic: 'orders-topic',
            messages: [
                { value: JSON.stringify(orderData) }
            ]
        });

        // Update the customer data in the customer collection
        await Customer.findByIdAndUpdate(
            orderData.customerId, // Find customer by ID
            { 
                $inc: { 
                    visits: 1, 
                    totalSpend: orderData.amount || 0 // Increment totalSpend by order amount
                } 
            },
            { new: true }
        );

        res.status(200).send('Order data sent to Kafka and customer data updated');
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send('Error sending order data');
    }
});

module.exports = router;
