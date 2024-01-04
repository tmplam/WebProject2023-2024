// require('dotenv').config();
// const passport = require('passport');
// const Auth = require('../models/auth.m');
// const MyStrategy = require('../utils/customSPP');
// const GoogleStrategy = require('../utils/customPassportGoogle');
// const bcrypt = require('bcrypt');
// const customError = require('../utils/custom-error');

// passport.serializeUser((user, done) => {
//     done(null, user.Username);
// });

// passport.deserializeUser(async (username, done) => {
//     // Retrieve the user from the database using the id
//     const user = await Auth.get(username);
//     if (!user) {
//         return done(new customError('invalid user', 500), null);
//     }
//     done(null, user);
// });

// module.exports = (app) => {
//     app.use(passport.initialize());
//     app.use(passport.session());

//     passport.use(
//         new MyStrategy(
//             async (username, password, done) => {
//                 const response = await Auth.get(username);
//                 let auth = false;
//                 if (response) {
//                     auth = await bcrypt.compare(password, response.Password);
//                 }
//                 if (auth) {
//                     return done(null, response);
//                 }
//                 done(new customError('invalid auth', 500));
//             },
//             {
//                 username: 'username',
//                 password: 'password',
//             }
//         )
//     );

//     passport.use(new GoogleStrategy());
// };
