const nodemailer = require("nodemailer");
module.exports = (user)=>{
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
        to:user.email,
        subject:`Welcome to Noter`,
        text:`Hello ${user.name}, Welcome to Noter.
        This email is only for testing purpose only.
        regards,
        Bhumanyu Kumar`
    }
    smtpTransport.sendMail(options,(err,info)=>{
        err?console.log("Error is ",err):console.log("Info is ",info);
    })
}
