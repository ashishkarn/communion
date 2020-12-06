const mongoose = require('mongoose');

userInfo = {
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    videoPaths: [{
        path: String,
        public: Boolean
    }]
}

module.exports = mongoose.model("userinfo", new mongoose.Schema(userInfo), "UserInfo")

