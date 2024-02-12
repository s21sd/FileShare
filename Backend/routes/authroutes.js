const express = require('express');
const User = require('../Models/userModels');
const Verification = require('../Models/verificationModel');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const nodemailer = require('nodemailer');
const resfunction = require('../utils/resfunction');
const authTokenHandler = require('../middlewares/checkauthMiddle');
const fs = require('fs');
const errormiddlewares = require('../middlewares/errorMiddle');
const checkauthmiddlewares = require('../middlewares/checkauthMiddle');
const verificationModel = require('../Models/verificationModel');
const errorHandler = require('../middlewares/errorMiddle');

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
            from: 'Team ShareSphere',
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
        await Verification.deleteOne({ email: email });
        const code = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, code);
        const newVarification = new Verification({ email: email, code: code })
        await newVarification.save();
        return resfunction(res, 200, 'OTP sent Successfully', null, true);

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
})
const upload = multer({ storage: storage });


const fileUploaFunction = (req, res, next) => {
    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            return resfunction(res, 400, 'File upload failed', null, false);
        }
        next();
    })
}
router.post('/register', fileUploaFunction, async (req, res, next) => {
    // console.log(req.file);
    try {
        const { name, email, password, otp } = req.body;
        let user = await User.findOne({ email: email });
        let varificationQueue = await Verification.findOne({ email: email });
        // console.log(otp);
        // console.log(varificationQueue.code);
        if (user) {
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
        }

        if (!varificationQueue) {
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
            return resfunction(res, 400, 'Please send otp first', null, false);
        }
        const isMatch = await bcrypt.compare(otp, varificationQueue.code);
        if (!isMatch) {

            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });

            }


            return resfunction(res, 400, 'Invalid OTP', null, false);
        }
        user = new User({
            name: name,
            email: email,
            password: password,
            profilePic: req.file.path
        })
        await user.save();
        await Verification.deleteOne({ email: email });
        return resfunction(res, 200, 'User Registered successfully', null, true);


    } catch (error) {
        console.log(error);
        return resfunction(res, 500, 'Internal server error', null, false);
    }
})


router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        return resfunction(res, 404, 'Invalid Credentials', null, false);
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return resfunction(res, 404, 'Invalid Credentials', null, false);

    }
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '50m' });

    res.cookie('authToken', authToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return resfunction(res, 200, 'User logged in successfully', {
        authToken,
        refreshToken
    }, true);

})


router.get('/checklogin', authTokenHandler, async (req, res, next) => {
    res.json({
        ok: req.ok,
        message: req.message,
        userId: req.userId
    });
});


router.post('/logout', authTokenHandler, async (req, res, next) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'Logged out successfully'
    });
});

router.get('/getuser', authTokenHandler, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return resfunction(res, 400, 'User not found ', null, false);
        }
        return resfunction(res, 200, 'User found ', user, true);
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);
module.exports = router;
