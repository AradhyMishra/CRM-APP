const { Kafka } = require('kafkajs');
const connectToMongo = require('./db');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

//Initialising Producer and consumer 
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'delivery-group' });

// Connect producer
const connectProducer = async () => {
    await producer.connect();
};

// Connect consumer
const connectConsumer = async () => {
    await consumer.connect();
    
};

module.exports = {
    producer,
    consumer,
    connectProducer,
    connectConsumer
};
