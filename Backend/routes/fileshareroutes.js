const express = require('express');
const User = require('../Models/userModels');
const Verification = require('../Models/verificationModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const nodemailer = require('nodemailer');
const resfunction = require('../utils/resfunction');
const authTokenHandler = require('../middlewares/checkauthMiddle');
const fs = require('fs');
const errormiddlewares = require('../middlewares/errorMiddle');

router.get('/test', (req, res) => {
    res.send('File routes is working fine ...')
})


async function mailer(recievemail, filesenderemail) {
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
            subject: 'New file',
            text: "Your recived a new file from " + filesenderemail,
            html: "<b>Your recived a new file from " + filesenderemail + "</b>"
        });

        console.log("Message is sent %s", info.messageId);
        console.log("Preview URL is %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
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


router.post('/sharefile', authTokenHandler, fileUploaFunction, async (req, res, next) => {
    try {
        const { senderemail, recievemail, filename } = req.body;
        console.log(req.body);
        let senderuser = await User.findOne({ email: senderemail });
        let recieveuser = await User.findOne({ email: recievemail });
        if (!senderuser) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            return resfunction(res, 400, 'Sender email is not registered ', null, false);
        }
        if (!recievemail) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            return resfunction(res, 400, 'Reciever email is not registered ', null, false);
        }
        senderuser.files.push({
            senderemail: senderemail,
            recieveuser: recievemail,
            fileurl: req.file.path,
            filename: filename,
            sharedAt: Date.now()
        })
        await senderuser.save();
        await recieveuser.save();
        await mailer(recievemail, senderemail);

    } catch (error) {
        next(error);
    }
})



module.exports = router;