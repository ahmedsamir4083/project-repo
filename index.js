if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userInfo = require('./models/userInfo');
const Joi = require('joi');
const {userschema} = require('./schemas.js')
// const req = require('express/lib/request');
// const res = require('express/lib/response');
const AsyncErrors = require('./helpers/AsyncErrors');
const ExpressErrors = require('./helpers/ExpressErrors');
const {isloggedin} = require('./helpers/auth');
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const usercontrol = require('./controllers/usercontrol');
const { Router } = require('express');
const MongoDBStore = require('connect-mongodb-session')(session);
const Facebookstrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const { profile } = require('console');
const { ifError } = require('assert');
// 'mongodb://localhost:27017/userdb'

// Database connection.
const dbUrl = process.env.dburl;

mongoose.connect( dbUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })



// const store = new MongoDBStore({
//     url: dbUrl,
//     secret: 'thisshouldbeabettersecret',
//     touchAfter: 24 * 60 * 60
// })

// store.on("error",function(e){
//     console.log("session error",e)  
// })

const sessionConfig = {
    // store,
    name:'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized : true,
    cookie:{
        httpOnly:true,  
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('tiny'));
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session()); 
passport.use(userInfo.createStrategy()); 
passport.serializeUser(userInfo.serializeUser());
passport.deserializeUser(userInfo.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://desolate-badlands-43727.herokuapp.com/auth/google/callback',
    scope: [ 'profile' ],
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    userInfo.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

const uservalidator =(req, res, next)=>{
const {error} = userschema.validate(req.body);
if(error){
    // const message=(error.message);
    // req.flash('error', message);
    // res.redirect('/newuser');
    const msg = error.details.map(el =>el.message).join(',')
    throw new ExpressErrors(msg,400);
} else{
    next();
}
}


app.get('/',usercontrol.home )

app.route('/newuser')
.get(usercontrol.newuserpage)
.post(uservalidator,AsyncErrors( usercontrol.newuser))


app.get('/loginpage', usercontrol.loginpage)

app.post('/login',passport.authenticate('local', {failureRedirect: '/loginpage', failureFlash: 'Invalid Email or password.'}) ,usercontrol.login) 

app.get('/login/google', passport.authenticate('google'));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/mainpage');
  });

app.get('/mainpage', isloggedin, usercontrol.mainpage)

app.get('/profile', async (req, res, next)=>{
  const user = req.user;
  res.render('profile', {user} );

})

app.get('/feeds', isloggedin, usercontrol.feeds)

app.get('/report/missing', isloggedin, usercontrol.reportmissing)

app.get('/report/find', isloggedin, usercontrol.reportfind)

app.get('/search', isloggedin, usercontrol.search)

app.get('/logout', usercontrol.logout)




 
app.all('*' , (req , res , next) =>{
     next(new ExpressErrors('Page Is Not Found' , 404))
})

app.use((err, req , res, next) =>{
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode);
    req.flash('error', message);
    res.redirect('/newuser');
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`serving on port ${port}`)
} )