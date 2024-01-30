const express = require('express');
const User = require('../Models/userModels');
const Verification = require('../Models/verificationModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const resfunction = require('../utils/resfunction');
const fs = require('fs');
const errormiddlewares = require('../middlewares/errorMiddle');
const checkauthmiddlewares = require('../middlewares/checkauthMiddle');

// async function mailer(recievemail, code) {
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         requireTLS: true,
//         auth: {
//             user: '',
//             pass: ''
//         }
//     });

//     let info = await transporter.sendMail({
//         from: 'Team Bits',
//         to: recievemail,
//         subject: 'OTP for verification',
//         text: "Your OTP is " + code,
//         html: "<b>Your OTP is " + code + "</b>"
//     });

//     console.log("Message is sent %s", info.messageId);
//     console.log("Preview URL is %s", nodemailer.getTestMessageUrl(info));
// }

router.get('/test', (req, res) => {
    res.send('Auth routes is working fine ...');
    // mailer("srivastavasunny359@gmail.com", 12345).catch(err => {
    //     console.error('Error sending email:', err);
    //     res.status(500).send('Internal Server Error');
    // });
});
const upload = multer({ storage: storage });

const fileUploaFunction = (req, res, next) => {
    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            return resfunction(res, 404, 'File upload failed ', null, false);
        }
        next();
    })
}

module.exports = router;
