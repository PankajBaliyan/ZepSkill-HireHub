let express = require('express')
let mongoose = require('mongoose')
let methodOverride = require('method-override')
const app = express()

//session requies
let path = require('path')
let session = require('express-session')

//passport requires
let passport = require('passport')
let localStrategy = require('passport-local')

//mongoose connect
mongoose.connect('mongodb+srv://admin:admin@cluster0.mkzkncr.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('db connected'))
.catch((err)=>console.log('404 Error', err))

//session setup
app.use(
     session({
          secret : 'SuperSecretPasswordForHireHub',
          resave : false,
          saveUninitialized : true,
          cookie :{
               httpOnly : true,
               expires : Date.now() + 1000 * 60 * 60 * 24,
               maxAge : 1000 * 60 * 60 * 24,
          }
     })
);

//Passport Setup
let User = require('./models/user-DB')
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); //authentication localStrategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use(function(req, res, next){
     res.locals.currentUser = req.user;
     next();
})

app.get('/', (req, res)=>{
     res.send('Hello World')
})

let jobRoute = require('./routes/jobs')
let notifRoute = require('./routes/notifications')
let authRoute = require('./routes/auth')
app.use(jobRoute);
app.use(notifRoute);
app.use(authRoute);

app.listen(3000, function(){
     console.log('server started on port 3000')
})