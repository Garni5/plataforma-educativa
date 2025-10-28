const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authService = require("../services/auth.service");

passport.serializeUser((user, done) => done(null, user.correo));
passport.deserializeUser((correo, done) => done(null, { correo }));

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const correo = profile.emails[0].value;     
        const apellidos = profile.name.familyName;    
        const nombres = profile.name.givenName;      
        const { persona, token } = await authService.loginSocial(correo, nombres, apellidos);
        done(null, { ...persona, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Microsoft Strategy
passport.use(
  new AzureAdOAuth2Strategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "/auth/microsoft/callback",
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        const decoded = jwt.decode(params.id_token);
        const correo = decoded.preferred_username;
        const nombre = decoded.name;
        const { persona, token } = await authService.loginSocial(correo, nombre);
        done(null, { ...persona, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
