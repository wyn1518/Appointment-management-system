
require('dotenv').config();
var express = require('express');
var passport = require('passport');
const router = express.Router();
var GoogleStrategy = require('passport-google-oauth20')
const {findOrCreate,findOne} = require('../controller/UsersController');

passport.serializeUser((user,done)=>{
    console.log(user);
    done(null, user);

});
passport.deserializeUser( async (user,done)=>{
    console.log(user);
    if(user !== null){
        done(null,user);
    }
});
passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        }, 
        async function(accessToken, refreshToken, profile, done) {
            const user = await findOrCreate(profile);
            done(null,user);
        }
    )
);


router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google',{ failureRedirect: '/' }),
    (req,res)=>{
        res.redirect('/')
    }
);

router.get('/logout' ,(req,res) => {
  
    req.logout(function(err) {
        if (err) { return next(err); }
  
        res.redirect('/');
    });
  
});
module.exports = router;