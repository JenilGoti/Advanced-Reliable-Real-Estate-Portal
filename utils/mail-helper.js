const nodemailer = require('nodemailer');


mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

exports.sendMail = (to, subject, body) => {
    const mailDetail={
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        html: body
    }
    return mailTransporter.sendMail(mailDetail);
};

