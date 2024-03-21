const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

const createUser = asyncHandler(async(req, res) => {
    const { firstName, lastName, email, phoneNumber, password, dateOfBirth } = req.body;

    // validate body
    if (!firstName || !lastName || !email || !password
            || !phoneNumber || !dateOfBirth) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error ('A user with that email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        dateOfBirth
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth
        })
    } else {
        res.status(400);
        throw new error('Invalid user data');
    }
});


const getUsers = asyncHandler(async(req, res) => {

    let users;
    const { fromDate, toDate } = req.query;

    // filter users based on query params
    if (fromDate.length === 0 && toDate.length === 0) {
        users = await User.find({}).sort('field -createdAt');
    } else if (fromDate.length !==0 && toDate.length !== 0) {
        users = await User
            .find({dateOfBirth: { $gte: fromDate, $lte: toDate}})
            .sort('field -createdAt');
    } else if (fromDate.length !== 0 && toDate.length === 0) {
        users = await User
            .find({dateOfBirth: { $gte: fromDate}})
            .sort('field -createdAt');
    } else if (fromDate.length === 0 && toDate.length !== 0) {
        users = await User
            .find({dateOfBirth: { $lte: toDate}})
            .sort('field -createdAt');
    }

    if (users.length > 0) {
        res.status(200).json(users)
    } else {
        res.status(500);
        throw new error('No users found');
    }
});

module.exports = {
    createUser,
    getUsers
}