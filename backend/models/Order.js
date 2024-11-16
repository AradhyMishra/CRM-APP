const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: String, required: true }, // Change to String or Number if appropriate
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
