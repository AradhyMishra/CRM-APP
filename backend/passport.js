const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
//This will generate a session for the authenticated user.

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/callback",// URL to redirect after Google login
            scope: ["profile","email"],
        },
        function(accessToken,refreshToken,profile,callback){
            // Called after Google returns user profile
            // Here, you can save the user profile in your database if needed
            // For now, we just pass the profile to the next step
            callback(null,profile);
        }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    done(null,user);
});