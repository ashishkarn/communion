const bcrypt = require('bcrypt')

async function createUser(res, err, req, collection, doc){
    //console.log(doc.length)
    if(doc.length>0){
        console.log(JSON.stringify(doc,null,'\t'))
        console.log(doc.length)
        return res.status(500).send("User already exists! Try another Username <a href=\"/\">Home</a>")
    }
    const hashedPass =  await bcrypt.hash(req.body.password, 10);
    const videoPaths = []
    videoPaths.push({path:"video.mp4", public:true}) 
    const user = {
        username:req.body.username, 
        firstName:req.body.firstname, 
        lastName:req.body.lastname,
        password:hashedPass,
        videoPaths: videoPaths
    }
    new collection(user).save()
    console.log("User Created")
    console.log(JSON.stringify(doc,null,'\t'))
    console.log(doc.length)
    return res.send("User created <a href=\"/\">Home</a>")
}

module.exports = {
    //fUser: findUser,
    cUser: createUser
}

