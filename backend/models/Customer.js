const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    joinDate: { type: Date, default: Date.now },
    totalSpend: { type: Number, default: 0 }, // Total spend amount, default is 0
    visits: { type: Number, default: 1 } // Number of visits, default is 1
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
