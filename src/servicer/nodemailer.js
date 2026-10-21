let nodemailer = require('nodemailer');

const sendMail = async (email, subject, message) => {


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            user: process.env.NODEMALIER_USER,
            pass: process.env.NODEMALIER_PASS
        }
    });

    let mailOptions = {
        from: process.env.NODEMALIER_USER,
        to: email , 
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail;