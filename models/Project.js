var mongoose = require('mongoose');
//let Work = require('../models/Work');

var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true, 
        unique:true
    },
    name:{
        type:String,
        required:true
    }
    ,
    profilePic: { 
        data: Buffer, 
        contentType: String 
    },
    username: String

})

var Project = mongoose.model("project", projectSchema);

module.exports = Project;