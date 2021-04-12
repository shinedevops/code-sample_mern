const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure : false,
    auth: {
        user: 'akarshan.shinedezign@gmail.com',
        pass: 'Shine@123'
    },
    tls: {
        rejectUnauthorized: false
    }
}));