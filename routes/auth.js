const bcrypt = require('bcrypt')

async function authorize(res, err, req, collection, doc){
    user=doc.find(user => user.username===req.body.username)
    if (user==null){
        return res.status(500).send("Wrong Username <a href=\"/\">Home</a>")
    }

    if(await bcrypt.compare(req.body.password, user.password)){

        //Creating some session data to reference data in db
        req.session.logged=true
        req.session.username=req.body.username
        req.session.loginTime=new Date(Date.now())
        
        console.log(req.session.logged)
        console.log("password match")
        console.log("Login performed by user: "+user.username)
        return  res.redirect(307,"/profile/")
    }else{
        return res.status(500).send("Wrong password <a href=\"/\">Home</a>")
    }
}

module.exports = authorize