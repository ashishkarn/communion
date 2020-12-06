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
const fs = require('fs')
const findUser = require('./routes/findUser')
const requestVideo =  require('./routes/requestVideo')

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
app.use(express.urlencoded())
//app.use(express.json())
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
    findUser.fUserB(res, req, UserInfo, register.cUser)
});

app.post('/signuppage', (req, res)=>{
  if(!req.session.logged){
    res.render("signuppage")
  }else{
    res.redirect(307, "/profile/")
  }
});

//URI for login
//Corroborate username from UserInfo. Retrieve document and compare password
//If authentication succesful, login user to profile, use cookie to check login status and
//Retrieve methods in auth.js
app.post('/login', (req, res)=>{
  console.log(req.body.username)
  if(!req.session.logged){
    findUser.fUserB(res, req, UserInfo, auth);
  }else{
    res.redirect(307, "/profile/")
  }
});

app.post('/loginpage', (req, res)=>{
  if(!req.session.logged){
    res.render("loginpage")
  }else{
    res.redirect(307, "/profile/")
  }
});

app.get('/logout', (req, res)=>{
  if(req.session.logged){
    req.session.username=""
    req.session.logged=false
    req.session.loginTime=0
    return res.redirect(307, "/")
  }
  return res.send("You have to log in first")
});

app.post('/profile/', (req, res)=>{
  if(req.session.logged){
    //Get user's video list from database, send a pug 
    //with the list of videos to watch with a GET method /profile/:username/:videoPath
    try{
      //Find all the users in the db with the logged username: req.session.username
      UserInfo.find({username: req.session.username}, (err, doc)=>{
          user = doc.find(user => user.username == req.session.username)
          res.render("profile",{
            paths: user.videoPaths,
            username: req.session.username
          })
      })
    }catch(err){
      console.log(err)
      res.status(500).send("Error<a href='/'>Home</a>")
    }
  }else{
    res.send("You have to Login first. <a href=\"/\">Home</a>")
    }
  }
)

app.get('/profile/:username/:pathToVideo', (req, res)=>{
  //user asks for a video using this URI.
  //Check if :username exists then if the video belongs to the :username, 
  //if yes check if it is requested by :username=req.session.username
  //if yes then send the video for streaming
  //if not then check if the video is set public by the :username in db, 
  //if yes send the video else deny access.
  console.log(requestVideo)
  findUser.fUserP(res, req, UserInfo, requestVideo.requestVideo)
  //res.send("Hello from " + req.params.username)
})

app.get('/video/:path', (req, res)=>{
  console.log("Yes")
  console.log(req.session.playbackVideo)
  console.log(req.params.path)
  if(req.session.playbackVideo===req.params.path){
    req.session.playbackVideo=""
    //const path = path.join(__dirname+"/videos"+req.params.path)
    const path = "./videos/" + req.params.path
    console.log(path)
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/webm',
      }
    res.writeHead(200, head)
    let stream=fs.createReadStream(path).pipe(res)
    stream.on('finish',function(){console.log("End video")})
    //res.send("Hello from " + req.params.username)
  }else{
    console.log("here")

    res.render("homepage")
  }
})

app.listen(8000)






