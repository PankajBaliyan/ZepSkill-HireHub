let mongoose = require('mongoose')


let jobSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    address : String,
    image : String,
    package : Number,
    cgpa : Number,
    deadline: {
        type : Date,
        default : Date.now
    },
    type: {
        type : String,
        dafault : 'fulltime'
    },
    appliedUsers : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
});

let Job = mongoose.model('job', jobSchema)
module.exports = Job;