const express = require("express");
const passport = require("passport");
const Skill = require("../models/Skill");

const router = express.Router();

// a route to create a new skills
router.post("/create", passport.authenticate("jwt", {session: false}), async(req, res) => {
    // 1. identify the user who is calling it
    const user = req.user;

    // 2. create the skill object
    const {skillName} = req.body;
    if (!skillName) {
        return res.status(402).json({err: "Invalid details"});
    }
    const skillObj = {skillName};
    const createdSkill = await Skill.create(skillObj);

    // 3. add skill to user
    user.skills.push(createdSkill._id);
    await user.save();

    // 4. return a response to user
    return res.status(200).json(createdSkill);
});

module.exports = router;