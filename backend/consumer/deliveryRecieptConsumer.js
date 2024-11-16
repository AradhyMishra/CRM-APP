const { consumer } = require('../kafkaConfig');
const axios = require('axios');

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'campaigns-topic', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { logId, status } = JSON.parse(message.value.toString());
    
            console.log(`Sending to /deliveryReceipt API: logId=${logId}, status=${status}`);
    
            try {
                // Calling the deliveryReceipt API to send data to kafka
                await axios.post(`http://localhost:8080/api/deliveryReciept`, {
                    logId,
                    status
                });
            } catch (error) {
                console.error('Error updating delivery receipt:', error.message);
            }
        },
    });
};

runConsumer().catch(console.error);

module.exports = runConsumer;
