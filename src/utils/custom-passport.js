require('dotenv').config();
const passport = require('passport');
const MyStrategy = require('../utils/custom-strategy');
const User = require('../models/user.m');
const bcrypt = require('bcrypt');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser((user, done) => {
    done(null, { username: user.username, darkMode: user.darkMode });
});

passport.deserializeUser(async (username, done) => {
    if (typeof username === 'object') {
        username = username.username;
    }

    const user = await User.getByUsername(username);

    if (!user) {
        return done('invalid', null);
    }
    if (!user.username) {
        return done('invalid', null);
    }
    done(null, user);
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: 'https://bookstoreapp.ddns.net/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const username = profile.emails[0].value;
                try {
                    let user = await User.getByUsername(username);

                    if (user && user.username) {
                        return done(null, user);
                    }

                    //insert user into database
                    user = new User({
                        username: username,
                        name: profile.displayName,
                        password: null,
                        email: profile.emails[0].value,
                        address: null,
                        avatar: profile.photos[0].value,
                        role: 1,
                        account_number: null,
                        phone_number: null,
                    });

                    delete user.id;
                    delete user.created_date;
                    await User.add(user);
                    done(null, user);
                } catch (err) {
                    console.err('Error verify with google', err);
                    done('invalid');
                }
            }
        )
    );

    passport.use(
        new MyStrategy(async (username, password, done) => {
            const user = await User.getByUsername(username);
            let auth = false;
            if (user && user.username) {
                auth = await bcrypt.compare(password, user.password);
            }
            if (auth) {
                return done(null, user);
            }

            done('invalid auth');
        })
    );
};
