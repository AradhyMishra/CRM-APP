const express = require('express');
const router = express.Router();
const { producer } = require('../kafkaConfig');
const Customer = require('../models/Customer');
const { body, validationResult } = require("express-validator");


// ROUTE1: ADD CUSTOMER DATA 
router.post('/customer',[
    // Name should not be empty
    body("name", "Name is required").notEmpty(),

    // Email should not be empty and must be a valid email
    body("email", "Please include a valid email").isEmail(),

  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) { //if validator founds some error
      return res.status(400).json({ success: false,errors: errors.array() });
    }
    const customerData = req.body;
   
    try {
        
        console.log(customerData);
        const existingCustomer = await Customer.findOne({email:customerData.email});
        if(existingCustomer){ //If customer already exists
            return res.status(400).send({message:"Customer already exists"})
        }
        await producer.send({
            topic: 'customers-topic',
            messages: [
                { value: JSON.stringify(customerData) }
            ]
        });
        res.status(200).send({customerData,message: 'Customer data stored in database througt kafka'}); //send data to kafka topic
    } catch (error) {
        res.status(500).send('Error sending customer data');
    }
});


//ROUTE 2: FETCH ALL CUSOTOMERS

// Route to get all customers
router.get('/fetchCustomers', async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.json({ customers });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customers' });
    }
});


//ROUTE 3 : DELETE CUSTOMERS

router.delete('/deleteCustomer', async (req, res) => {
    try {
        const { customerId } = req.body;

        
        if (!customerId) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        // Delete the customer
        const customer = await Customer.findByIdAndDelete(customerId); 
        if (!customer) {
            return res.status(404).json({ message: 'Customer does not exist or invalid ID' });
        }

        res.json({ message: `Customer ${customer.name} deleted successfully` });
    } catch (error) {
        console.error('Error deleting the customer:', error);
        res.status(500).json({ error: 'Error deleting the customer' });
    }
});

module.exports = router;