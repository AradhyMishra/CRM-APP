const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      date: { type: Date, default: Date.now },
    },
    { collection: 'users' } // Explicit collection name
  );
  

// This line creates a Mongoose model for the 'user' collection(create a collection named 'users'(name is pluraized) in the database which will store data according to schema specified)
const User = mongoose.model('user',userSchema);

module.exports = User;