const express = require("express");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const experienceRoutes = require("./routes/experience");
const skillRoutes = require("./routes/skill");
const projectRoutes = require("./routes/project");
const User = require("./models/User");

require("dotenv").config();
const PORT = 8000;

const app = express();
app.use(express.json());

// to connect to mongodb from node, we use to need mongoose.connect()
// it will take two arguments: 1. connection string, 2. connection option
mongoose.connect(
    "mongodb+srv://admin:" + process.env.MONGO_PASSWORD + "@connectit.quoeub7.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
    }
).then((x) => {
    console.log("Connected to mongo!");
}).catch((err) => {
    console.log("Error occurred while connected to mongo");
    console.log(err);
});

// passport jwt settup
// jwt_payload : {identifier: userId}
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisIsSupposeToBeSecret";
passport.use(
    new jwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user = await User.findOne({ _id: jwt_payload.identifier });
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        } catch {
            if (err) {
                done(err, false);
            }
        }
            
    })
);

app.get("/", (req, res) => {
    res.send("I am working");
});

app.use("/auth", authRoutes); 
app.use("/experience", experienceRoutes);
app.use("/skill", skillRoutes);
app.use("/project", projectRoutes);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});