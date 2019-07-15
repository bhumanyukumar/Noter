const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CS,{useNewUrlParser:true},(err)=>{
    console.log(err?"Error in DB Connection":"Database connected");
});
module.exports = mongoose;