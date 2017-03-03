var mongoose = require('mongoose');

var workSchema = mongoose.Schema({
            username: String,
   
    description: String, 
    title: String,
    
    URL: [String],
        //{type: Array, "default" : [] }
    screenshot: []
    //     [{ 
    //     data: Buffer, 
    //     contentType: String 
    // }]
})

var Work = mongoose.model("work", workSchema);

module.exports = Work;
