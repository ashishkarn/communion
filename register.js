const bcrypt = require('bcrypt')

function findUser(res, req, collection, callback){
    console.log("at createUser func:"+ req)
    try{
        collection.find({username: req.body.username}, (err, doc)=>{
            callback(res, err, req, collection, doc)
        })
      }catch(err){
        console.log(err)
        res.status(500).send("Error")
    }
}

async function createUser(res, err, req, collection, doc){
    console.log(doc.length)
    if(doc.length>0){
        console.log(JSON.stringify(doc,null,'\t'))
        console.log(doc.length)
        return res.status(500).send("User already exists! Try another Username")
    }
    const hashedPass =  await bcrypt.hash(req.body.password, 10);
    const user = {
        username:req.body.username, 
        firstName:req.body.firstname, 
        lastName:req.body.lastname,
        password:hashedPass
    }
    new collection(user).save()
    console.log("User Created")
    console.log(JSON.stringify(doc,null,'\t'))
    console.log(doc.length)
    return res.send("User created")
}

module.exports = {
    fUser: findUser,
    cUser: createUser
}

