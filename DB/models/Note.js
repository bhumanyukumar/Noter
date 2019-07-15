const mongoose = require("../connection");
const NoteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("notes",NoteSchema);