const moongose = require('mongoose')
const passportLocalMoongose = require('passport-local-mongoose');

const userSchema = new moongose.Schema({
    email:{
        type:String,
        require: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMoongose);

module.exports = new moongose.model('User', userSchema)