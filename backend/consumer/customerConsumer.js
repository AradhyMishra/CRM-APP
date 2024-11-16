const { Kafka } = require('kafkajs');
const Customer = require('../models/Customer'); 
const connectToMongo = require('../db'); 


const kafka = new Kafka({ clientId: 'my-app', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'customer-group' });

const run = async () => {
   
    await connectToMongo();

    // Connected to Kafka and subscribed to the 'customers-topic'
    await consumer.connect();
    await consumer.subscribe({ topic: 'customers-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const customerData = JSON.parse(message.value.toString());
            console.log("Received customer data from Kafka:", customerData);

            // Validate required fields for the customer data
            if (!customerData.name || !customerData.email) {
                console.warn("Invalid customer data received, missing required fields:", customerData);
                return; 
            }

            try {
                //for avoiding duplicate entries, email needs to be unique
                const result = await Customer.findOneAndUpdate(
                    { email: customerData.email },
                    {
                        name: customerData.name,
                        email: customerData.email,
                        age: customerData.age,
                        joinDate: customerData.joinDate || Date.now(),
                        
                        $setOnInsert: { visits: 1, totalSpend: customerData.totalSpend || 0 }
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true } 
                );
                console.log("Customer data processed in MongoDB:", result);
            } catch (error) {
                console.error("Error processing customer data in MongoDB:", error);
            }
        },
    });
};

run().catch(console.error);
