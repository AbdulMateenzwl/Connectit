const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {getToken} = require("../utils/helpers")

const router = express.Router();

router.post("/register", async (req, res) => {
    //This is the function that is handle user register logic
    // step 1: get the details from req.body
    const {firstName, lastName, email, password} = req.body;
    if (!firstName || !email || !password) {
        return res.status(400).json({err: "Invalid Request Body"});
    }

    // step 2: we will check if user with that email already exists, this is not allow to register
    const existingUser = await User.findOne({email: email});
    if (existingUser) {
        return res.status(402).json({err: "A user with this email is already exists"});
    }

    // step 3: this is legitimate user request, Now we will create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserDetails = {firstName, lastName, email, password: hashedPassword};
    const newUser = await User.create(newUserDetails);

    // step 4: I can a use a new user to create a jwt and return a token to a user.
    const token = await getToken(email, newUser);
    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);  

});

router.post("/login", async (req, res) => {
    //step 1: get the user from req.body
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(401).json({err: "Invalid email or password"});
    }

    //step 2: verify the user if the user is existing with that email
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(401).json({err: "Invalid email or password"});
    }

    //step 3: verify if the password he provided is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({err: "Invalid password"});
    }

    //step 4: generate a token for a user and return it
    const token = await getToken(email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);  
});

module.exports = router;