const nodemailer = require("nodemailer");
module.exports = (email,subject,message)=>{
    const transport = {
        service:"gmail",
        auth:{
            user:process.env.EMAIL_ID,
            pass:process.env.EMAIL_PASSWORD
        }
    }
    const smtpTransport = nodemailer.createTransport(transport);
    const options = {
        from:"Noter <notermail86@gmail.com>",
        to:email,
        subject:subject,
        text:message
    }
    smtpTransport.sendMail(options,(err,info)=>{
        err?console.log("Error is while sending email ",err):console.log("Info is ",info);
    })
}
