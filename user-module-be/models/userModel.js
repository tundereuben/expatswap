const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Enter your first name']
    },
    lastName: {
        type: String,
        required: [true, 'Enter your last name']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Enter your phone number']
    },
    email: {
        type: String,
        required: [true, 'Enter your Email'],
        unique: true
    }, 
    password: {
        type: String,
        required: [true, 'Enter your password']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Enter your date of birth']
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);