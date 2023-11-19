const express = require("express");
const passport = require("passport");
const Project = require("../models/Project");

const router = express.Router();

// a route to create a new skills
router.post("/create", passport.authenticate("jwt", {session: false}), async(req, res) => {
    // 1. identify the user who is calling it
    const user = req.user;

    // 2. create the skill object
    const {name, description, links} = req.body;
    if (!name) {
        return res.status(402).json({err: "Invalid details"});
    }
    const projectObj = {name, description, links};
    const project = await Project.create(projectObj);

    // 3. add skill to user
    user.projects.push(project._id);
    await user.save();

    // 4. return a response to user
    return res.status(200).json(project);
});

module.exports = router;