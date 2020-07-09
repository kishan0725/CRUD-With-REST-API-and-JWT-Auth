const express = require('express');
const expressRoute = express.Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
expressRoute.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body); // validate the data
    if (error) return res.status(400).send(error.details[0].message);

    // check if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send("Email already exist");

    // hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // create a new user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const registeredUser = await newUser.save();
        res.json({
            name: newUser.name,
            email: newUser.email
        });
    }
    catch(err) {
        res.status(400).send(`Unable to register - ${err}`);
    }
    
});

// login
expressRoute.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body); // validate the data
    if (error) return res.status(400).send(error.details[0].message);

    // check if the email matches the email in the database
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Email doesn't exist!");

    // check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Incorrect Password!");

    // create and assign a token
    const token = jwt.sign({_id:user._id}, process.env.SECRET_TOKEN);
    res.header('auth-token', token).send(token);
    res.status(200).send("Logged in!");
})

module.exports = expressRoute;