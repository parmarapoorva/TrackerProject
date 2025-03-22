// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const passport = require("passport");

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             callbackURL: "http://localhost:9000/auth/google/callback", // Ensure full URL
//             scope: ["profile", "email"],
//         },
//         function (accessToken, refreshToken, profile, callback) {
//             callback(null, profile);
//         }
//     )
// );

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// module.exports = passport; // Export to use in other files
