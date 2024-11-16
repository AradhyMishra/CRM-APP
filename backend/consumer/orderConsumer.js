const { Kafka } = require('kafkajs');
const Order = require('../models/Order');
const connectToMongo = require('../db');

const kafka = new Kafka({ clientId: 'my-app', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'order-group' });

const run = async () => {
   
    await connectToMongo();

    // Connect to Kafka and subscribe to the topic
    await consumer.connect();
    await consumer.subscribe({ topic: 'orders-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const orderData = JSON.parse(message.value.toString());
            console.log("Received order data from Kafka:", orderData);

            // Validating essential fields 
            if (!orderData.customerId || !orderData.amount) {
                console.warn("Invalid order data received, missing required fields:", orderData);
                return;
            }

            try {
                
                const result = await Order.findOneAndUpdate(
                    { customerId: orderData.customerId, date: orderData.date }, // Match by customerId and date
                    {
                        customerId: orderData.customerId,
                        amount: orderData.amount,
                        date: orderData.date || Date.now(),
                        status: orderData.status || 'Pending' 
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true } 
                );
                console.log("Order data processed in MongoDB:", result);
            } catch (error) {
                console.error("Error processing order data in MongoDB:", error);
            }
        },
    });
};

run().catch(console.error);
