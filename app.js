require('dotenv').config()
const express = require('express')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');


const app = express()
const port = 3000

app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRET_GOOGLE,
        callbackURL: process.env.CLIENT_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        // You can save user data to your database here
        console.log("Printing for understanding",profile)
        return done(null, profile);
      }
    )
  );


  app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });


  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/'); // Redirect to your React app's homepage after successful login
    }
  );


  app.get('/profile', (req, res) => {
    if(!req.isAuthenticated()) {
      return res.status(401).send({ error: 'Unauthorized access!!!'})
    }
    res.send("Profile")
  })
  
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  app.get('/user', (req, res) => {
    res.json(req.user);
  });
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
