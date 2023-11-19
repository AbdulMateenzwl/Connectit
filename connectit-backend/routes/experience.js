const express = require("express");
const passport = require("passport");
const Experience = require("../models/Experience");

const router = express.Router();

// a route to create a new experience
router.post("/create", passport.authenticate("jwt", {session: false}), async(req, res) => {
    // 1. identify the user who is calling it
    const user = req.user;

    // 2. create the experience object
    const {companyName, position, startDate, endDate, description} = req.body;
    if (!companyName || !position) {
        return res.status(402).json({err: "Invalid details"});
    }
    const experienceObj = {
        companyName,
        position,
        startDate,
        endDate,
        description,
    };
    const experience = await Experience.create(experienceObj);

    // 3. add experience to user
    user.experiences.push(experience._id);
    await user.save();

    // 4. return a response
    return res.status(200).json(experience);
});

module.exports = router;