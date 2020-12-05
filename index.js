const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const path = require('path')
const mongoose = require('mongoose')
const UserInfo = require('./model')
const users = []
const register = require('./register')

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

//Render html using pug, res.render()
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Homepage URI. Single Get request.
app.get('/',(req, res)=>{
    res.render("homepage")
});

//URI for signup. Use only POST method.
//Confirm no duplication of username and add the user to the test/UserInfo collection
//Methods to query db in register.js
app.post('/signup',  (req, res)=>{
  console.log("at uri callback:"+ req)
    register.fUser(res, req, UserInfo, register.cUser)
});

//URI for login
//Corroborate username from UserInfo. Retrieve document and compare password
//If authentication succesful, login user to profile, use cookie to check login status and
//Retrieve methods in auth.js
app.post('/login', async (req, res)=>{
  try{
    user=users.find(user => user.name===req.body.name)

    if(user==null){
      console.log("user null")
      return res.status(400).send()
    }

    if(await bcrypt.compare(req.body.password, user.password)){
      console.log("password match")
      console.log("Login performed by user: "+user.name)
      return res.send("User Login: "+user.name)
    }

    res.status(200).send("User not found")
  }catch(err){
    console.log(err)
    res.status(500).send("Error")
  }
});

app.listen(8000)






