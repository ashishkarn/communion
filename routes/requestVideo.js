function requestVideo(res, err, req, collection, doc){
    //check if username exists in db
    if(doc.length>0){
        user = doc.find(user => user.username===req.params.username)
        if(user==null){
            return res.send("User Doesnt exists")
        }
        //check if video belongs to the user
        //extract user.videopaths list and find req.params.pathToVideo
        pathToVideoDict=user.videoPaths.find(pathToVideoD => pathToVideoD.path===req.params.pathToVideo)
        if(pathToVideoDict==null){
            return res.send("Video Doesnt belong to the user")
        }
        //check if the logged user and request user are same, if yes then send video
        //otherwise check if public, then sendVideo
        //
        if(req.params.username==req.session.username || pathToVideoDict.public==true){
            return sendVideoPug(res, req, req.params.pathToVideo)
        }else{
            return res.send("User hasnt made the video public.")
        }
    }else{
        return res.send("Username doesnt exist")
    }
}

function sendVideoPug(res, req, path){
    //send pug to user to hit /video/pathToVideo
    req.session.playbackVideo=path
    //res.send("FInal")
    res.render("videostream.pug",{pathToVideo:path})
}

module.exports ={
    requestVideo: requestVideo
}