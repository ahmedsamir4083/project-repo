const { path } = require('express/lib/application');
const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const passport = require('passport');

const userInfoSchema = new mongoose.Schema({
    fName: {
        type: String,
        // required: true
    },
    lName: {
        type: String,
        // required: true
    },

    // Username: {
    //     type: String,
    //     // required: true,
    //     unique: true,
    // },

    mobileNum: {
        type: String,
        // required: true,
        unique: true,
    },
    Email: {
        type: String,
         required: true,
        unique: true,
    },
    //  
    nationalId:{
        type: Number,
        // required: true,
        minlength: 14,
        maxlength: 14,
        unique: true,
    },
    birthDate:{
        type: Date,
        // required:true,
    }
});
userInfoSchema.plugin(passportlocalmongoose);

const userInfo = mongoose.model('userInfo', userInfoSchema);
module.exports = userInfo;