const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User"); 

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login failure",
    });
});

router.get("/login/success", (req, res) => {
    if (req.user) {
        console.log(req.user);
        res.status(200).json({
            error: false,
            message: "Successfully logged in :)",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

// Initiating Google login
router.get("/google", passport.authenticate("google", ["profile", "email"]));

// Google callback route
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login/failed",
    }),
    async (req, res) => {
        try {
            // Checking if user already exists in MongoDB
            const existingUser = await User.findOne({ email: req.user.emails[0].value });

            if (!existingUser) {
                // If user does not exist, create a new user
                const newUser = new User({
                    name: req.user.displayName,
                    email: req.user.emails[0].value,
                });
                await newUser.save();
                req.user.dbUser = newUser;
            } else {
                // User exists, attach the existing user data to req.user
                req.user.dbUser = existingUser;
            }

            // Redirect to client with session established
            res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            console.error("Error during Google callback:", error);
            res.redirect("/login/failed");
        }
    }
);

// Logout route
router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;
