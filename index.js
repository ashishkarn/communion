const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const path = require('path')
const mongoose = require('mongoose')
const UserInfo = require('./model')
const users = []
const register = require('./routes/register')
const auth = require('./routes/auth')
const session = require('express-session')

//DB connection
try{
  mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true });
}catch(err){
  console.log(err)
}

//Connection object for Model Manipulation. 
//Use only UserInfo model to query UserInfo collection in Test db
const db = mongoose.connection
db.on('error', ()=>console.log("Ignore"));
db.once('open', ()=>{console.log("Connection...")})

//For parsing application/json requests
app.use(express.json())
app.use(session({
  secret: 'baap'
}))

//Render html using pug, res.render()
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Homepage URI. Single Get request.
app.get('/',(req, res)=>{  
    req.session.pageVisitTime=Date.now()
    res.render("homepage")
});

//URI for signup. Use only POST method.
//Confirm no duplication of username and add the user to the test/UserInfo collection
//Methods to query db in register.js
app.post('/signup',  (req, res)=>{
    if(req.session.logged){
      req.session.username=""
      req.session.logged=false
      req.session.loginTime=0
    }
    register.fUser(res, req, UserInfo, register.cUser)
});

//URI for login
//Corroborate username from UserInfo. Retrieve document and compare password
//If authentication succesful, login user to profile, use cookie to check login status and
//Retrieve methods in auth.js
app.post('/login', (req, res)=>{
  if(!req.session.logged){
    register.fUser(res, req, UserInfo, auth);
  }else{
    res.send("User already logged in")
  }
});

app.get('/logout', (req, res)=>{
  if(req.session.logged){
    req.session.username=""
    req.session.logged=false
    req.session.loginTime=0
    return res.send("Logged out")
  }
  return res.send("You have to log in first")
});

app.get('/profile/', (req, res)=>{
  if(req.session.logged){
    //Get user's video list from database, send a pug 
    //with the list of videos to watch with a GET method /profile/:username/:videoPath
    res.render("profile",{
      paths:["video.mp4", "two.mp4", "3.mp4"],
      username: req.session.username
  })
  }else{
    res.send("You have to Login first.")
  }
})

app.get('/profile/:username/:pathToVideo', (req, res)=>{
  //ask for a video here.
  //Check if username exists then if the video belongs to the :username, 
  //if yes check if it is requested by :username=req.session.username
  //if yes then send the video for streaming
  //if not then check if the video is set public by the :username in db, 
  //if yes send the video else deny access.
  res.send("Hello from " + req.params.username)
})

app.listen(8000)






