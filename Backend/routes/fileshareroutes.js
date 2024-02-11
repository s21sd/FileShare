// const express = require('express');
// const User = require('../Models/userModels');
// const Verification = require('../Models/verificationModel');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const multer = require('multer');
// const nodemailer = require('nodemailer');
// const resfunction = require('../utils/resfunction');
// const authTokenHandler = require('../middlewares/checkauthMiddle');
// const fs = require('fs');
// const errormiddlewares = require('../middlewares/errorMiddle');

// router.get('/test', (req, res) => {
//     res.send('File routes is working fine ...')
// })


// async function mailer(recievemail, filesenderemail) {
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         requireTLS: true,
//         auth: {
//             user: 'sunnysrivastava258@gmail.com',
//             pass: 'lkdk nhga zhjc xrip'
//         }
//     });

//     try {
//         let info = await transporter.sendMail({
//             from: 'Team Bits',
//             to: recievemail,
//             subject: 'New file',
//             text: "Your recived a new file from " + filesenderemail,
//             html: "<b>Your recived a new file from " + filesenderemail + "</b>"
//         });

//         console.log("Message is sent %s", info.messageId);
//         console.log("Preview URL is %s", nodemailer.getTestMessageUrl(info));
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// }
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public');
//     },
//     filename: (req, file, cb) => {
//         let fileType = file.mimetype.split('/')[1];
//         console.log(req.headers.filename);
//         cb(null, `${Date.now()}.${fileType}`);
//     }
// });
// const upload = multer({ storage: storage });

// const fileUploaFunction = (req, res, next) => {
//     upload.single('clientfile')(req, res, (err) => {
//         if (err) {
//             return resfunction(res, 404, 'File upload failed ', null, false);
//         }
//         next();
//     })
// }


// router.post('/sharefile', authTokenHandler, fileUploaFunction, async (req, res, next) => {
//     try {
//         const { recievemail, filename } = req.body;
//         console.log(req.body);
//         console.log(recievemail);
//         let senderuser = await User.findOne({ _id: req.userId });
//         console.log(senderuser.email);
//         let recieveuser = await User.findOne({ email: recievemail });

//         if (!senderuser) {
//             if (req.file && req.file.path) {
//                 fs.unlink(req.file.path, (err) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     else {
//                         console.log('File deleted successfully');
//                     }
//                 })
//             }
//             return resfunction(res, 400, 'Sender email is not registered ', null, false);
//         }
//         if (!recieveuser) {
//             if (req.file && req.file.path) {
//                 fs.unlink(req.file.path, (err) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     else {
//                         console.log('File deleted successfully');
//                     }
//                 })
//             }
//             return resfunction(res, 400, 'Reciever email is not registered ', null, false);
//         }
//         senderuser.files.push({
//             senderemail: senderuser.email,
//             receiveremail: recievemail,
//             fileurl: req.file.path,
//             filename: filename ? filename : new Date().toLocaleDateString(),
//             sharedAt: Date.now()
//         })

//         recieveuser.files.push({
//             senderemail: senderuser.email,
//             receiveremail: recievemail,
//             fileurl: req.file.path,
//             filename: filename ? filename : new Date().toLocaleDateString(),
//             sharedAt: Date.now()
//         })
//         await senderuser.save();
//         await recieveuser.save();
//         await mailer(recievemail, senderuser.email);
//         return resfunction(res, 200, 'shared successfully', null, true);

//     } catch (error) {
//         next(error);
//     }
// })

// router.use(errormiddlewares)

// module.exports = router;




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


async function mailer(recieveremail, filesenderemail) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'sunnysrivastava258@gmail.com',
            pass: 'lkdk nhga zhjc xrip'
        }
    })

    let info = await transporter.sendMail({
        from: "Team ShareSphere",
        to: recieveremail,
        subject: "New File",
        text: "You recieved a new file from " + filesenderemail,
        html: "<b>You recieved a new file from  " + filesenderemail + "</b>",

    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

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

const fileUploadFunction = (req, res, next) => {

    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            return resfunction(res, 400, 'File upload failed', null, false);
        }
        next();
    })
}

router.get('/test', (req, res) => {
    res.send('File share routes are working!');
});

router.post('/sharefile', authTokenHandler, fileUploadFunction, async (req, res, next) => {
    try {
        const { receiveremail, filename } = req.body;
        // console.log(req.body);
        let senderuser = await User.findOne({ _id: req.userId });
        let recieveruser = await User.findOne({ email: receiveremail });
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
            return resfunction(res, 400, 'Sender email is not registered', null, false);
        }
        if (!recieveruser) {

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

            return resfunction(res, 400, 'Reciever email is not registered', null, false);
        }


        if (senderuser.email === receiveremail) {
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

            return resfunction(res, 400, 'Reciever email cannot be same as sender', null, false);
        }

        senderuser.files.push({
            senderemail: senderuser.email,
            receiveremail: receiveremail,
            fileurl: req.file.path,
            filename: filename ? filename : new Date().toLocaleDateString(),
            sharedAt: Date.now()
        })

        recieveruser.files.push({
            senderemail: senderuser.email,
            receiveremail: receiveremail,
            fileurl: req.file.path,
            filename: filename ? filename : new Date().toLocaleDateString(),
            sharedAt: Date.now()
        })

        await senderuser.save();
        await recieveruser.save();
        await mailer(receiveremail, senderuser.email);
        return resfunction(res, 200, 'shared successfully', null, true);

    }
    catch (err) {
        next(err);
    }
})

router.get('/getfiles', authTokenHandler, async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.userId })
        if (!user) {
            return resfunction(res, 400, 'User Not Found', null, false);
        }
        return resfunction(res, 200, 'Files Fetched Successfully', user.files, true);
    } catch (error) {
        next(error)
    }
})

router.use(errormiddlewares)

module.exports = router;