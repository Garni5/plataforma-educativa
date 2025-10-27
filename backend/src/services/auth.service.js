const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
const jwt = require("jsonwebtoken");
require('dotenv').config();


const users = []; // Base de datos en memoria

// Serialización Passport
passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser((email, done) => {
  const user = users.find(u => u.email === email);
  done(null, user || null);
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  let user = users.find(u => u.email === profile.emails[0].value);
  if (!user) {
    user = { email: profile.emails[0].value, name: profile.displayName };
    users.push(user);
  }
  done(null, user);
}));

// Microsoft Strategy
passport.use(new AzureAdOAuth2Strategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: "/auth/microsoft/callback"
}, (accessToken, refreshToken, params, profile, done) => {
  const decoded = jwt.decode(params.id_token);
  let user = users.find(u => u.email === decoded.preferred_username);
  if (!user) {
    user = { email: decoded.preferred_username, name: decoded.name };
    users.push(user);
  }
  done(null, user);
}));

// Exportamos DB para usar en controladores si queremos
module.exports = { users };
