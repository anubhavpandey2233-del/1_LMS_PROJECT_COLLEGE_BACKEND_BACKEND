const passport = require('passport');
const users = require('../model/user.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const GoogleProvider = () => {
    try {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3030/api/v2/user/auth/google/callback"
        },

            async function (accessToken, refreshToken, profile, cb) {
                console.log(profile);

                const userData = await users.findOne({email: profile.emails[0].value});

                if (!userData) {
                    const user = await users.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleID: profile.id,
                        is_verify : true
                    })

                    return cb(null, user);
                }

                return cb(null, userData);

            }
        ));

        passport.serializeUser(function (user, done) {
            console.log("ssss", user)
            done(null, user._id);
        });

        passport.deserializeUser(async function (_id, done) {
            console.log("dddd", _id);
            
            const usersD =  await users.findById(_id);

            console.log("uuuu", usersD);
            

            if(usersD){
                done(null, usersD);
            } else {
                done('user not found.' , null)
            }
            
        });
    } catch (error) {
        console.log(error);

    }
}

const FacebookProvider = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3030/api/v2/user/auth/facebook/callback"
    },

        async function (accessToken, refreshToken, profile, cb) {

            console.log(profile);

            const user = await users.create({
                name: profile.displayName,
                facebookID: profile.id
            })

            // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
        }
    ));
}

module.exports = {
    GoogleProvider,
    FacebookProvider
};