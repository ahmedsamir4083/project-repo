const express = require('express');
const app = express();
const path = require('path');
var morgan = require('morgan');
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
const Localstratigy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
// const validateuserinfo = require('./helpers/Joival');
// const { NOTFOUND } = require('dns');
 
mongoose.connect('mongodb://localhost:27017/usersdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


const sessionConfig = {
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
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new Localstratigy(userInfo.authenticate()));

passport.serializeUser(userInfo.serializeUser());
passport.deserializeUser(userInfo.deserializeUser());
const uservalidator =(req, res, next)=>{
const {error} = userschema.validate(req.body);
if(error){
    const msg = error.details.map(el =>el.message).join(',')
    throw new ExpressErrors(msg,400);
} else{
    next();
}
}


app.get('/', (req, res) => {
    res.render('home', {messages: req.flash('success')})
})

app.get('/userInfo', (req, res) => {
    res.render('signupPage');
})

app.post('/userInfo',  uservalidator,AsyncErrors( async (req, res , next) => {
    const{ username } = req.body;
    const{Password} = req.body;
     const user = new userInfo(req.body);
    const registerduser = await userInfo.register(user,Password);
    req.login(registerduser, err => {
        if(err) return next(err);
        res.redirect('/loginpage') 
    })
     

}))

app.get('/loginpage', (req, res) => {
     res.render('loginpage', {messages: req.flash('error')} );
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/loginpage', failureFlash: 'Invalid username or password.'}), (req, res , next) =>{
    //  if(!req.body.username) throw new ExpressErrors('Invalid username Or Password!', 401);
    // const Email = (req.body.Email);
    // const email = await userInfo.findOne({ Email: Email });
    // console.log(email);
    req.flash('success', "welcome back!");
    res.redirect('/mainpage') 
    }) 
    

app.get('/allusers', AsyncErrors( async (req, res) => {
    const allusers = await userInfo.find({});
    console.log(allusers);
    if(allusers.length == 0)  throw new ExpressErrors('There Is Not Any User Yet !', 400);
    else {
         res.render('allusers', {allusers})
     }
}))

app.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/')
})

app.get('/mainpage', isloggedin, (req, res) => {
    res.render('mainpage', {messages: req.flash('success')})
})

// app.get('/fake' ,async (req, res) =>{
//   const user = new userInfo({username: 'Ahmed566654dasd', fName : 'ahmeda' , lName: 'samira' , mobileNum: '011126778762', Email:"cocoxoaaxoqq@ccx.com", nationalId: 12765478765422 , birthDate: 12/12/2000})
//   const newuser = await userInfo.register(user, 'chikennan')
//   res.send(newuser);
// })

// app.get('/loginpage', (req, res) => {
//     res.render('loginpage');
// })


// app.get('/profile/:id', AsyncErrors( async (req, res) => {
//     const { id } = req.params;
//     const userprofile = await userInfo.findById(id);
//     res.render('profile', {userprofile})
// }))

app.all('*' , (req , res , next) =>{
    next(new ExpressErrors('Page Is Not Found' , 404))
})

app.use((err, req , res, next) =>{
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).send(message)
})
app.listen(3000, ()=>{
    console.log("serving on port 3000")
} )