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

async function mailer(recievemail, code) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'sunnysrivastava258@gmail.com',
            pass: 'lkdk nhga zhjc xrip'
        }
    });

    try {
        let info = await transporter.sendMail({
            from: 'Team Bits',
            to: recievemail,
            subject: 'OTP for verification',
            text: "Your OTP is " + code,
            html: "<b>Your OTP is " + code + "</b>"
        });

        console.log("Message is sent %s", info.messageId);
        console.log("Preview URL is %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

router.get('/test', (req, res) => {
    res.send('Auth routes is working fine ...');
    // mailer("srivastavasunny359@gmail.com", 12345).catch(err => {
    //     console.error('Error sending email:', err);
    //     res.status(500).send('Internal Server Error');
    // });
});
router.post('/sendotp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return resfunction(res, 400, "Email is required", null, false);
    }
    try {
        const code = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, code);
        const newVarification = new Verification({ email: email, code: code })
        await newVarification.save();
        return resfunction(res, 200, 'OTP sent Successfully', null, false);

    } catch (error) {
        console.log(error);
        return resfunction(res, 500, 'Internal server error', null, false);
    }
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        let fileType = file.mimetype.split('/')[1];
        console.log(req.headers.filename);
        cb(null, `${Date.now()}.${fileType}`);
    }
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
router.post('/register', fileUploaFunction, async (req, res, next) => {
    console.log(req.file);
})


module.exports = router;
