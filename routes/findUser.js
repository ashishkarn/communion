function findUserFromBody(res, req, collection, callback){
    try{
        //Find all the users in the db with the username: req.body.username
        collection.find({username: req.body.username}, (err, doc)=>{
            callback(res, err, req, collection, doc)
        })
      }catch(err){
        console.log(err)
        res.status(500).send("Error Username not found <a href='/'>Home</a>")
    }
}

function findUserFromParams(res, req, collection, callback){
    try{
        //Find all the users in the db with the username: req.body.username
        collection.find({username: req.params.username}, (err, doc)=>{
            callback(res, err, req, collection, doc)
        })
      }catch(err){
        console.log(err)
        res.status(500).send("Error<a href='/'>Home</a>")
    }
}

module.exports = {
    fUserP: findUserFromParams,
    fUserB: findUserFromBody
}

