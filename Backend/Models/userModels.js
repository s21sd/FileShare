const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const fileSchema = new mongoose.Schema({
    senderemail: {
        requried: true,
        type: String
    },
    reciveremail: {
        requried: true,
        type: String
    },
    fileurl: {
        requried: true,
        type: String
    },
    filename: {
        requried: true,
        type: String
    },
    sharedAt: {
        requried: true,
        type: Date
    }
}, { timestamp: true });

const userScherma = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    profilePic: {
        required: true,
        default: 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg'
    },
    files: {
        type: [fileSchema],
        default: []
    }

}, { timestamp: true })

userScherma.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})
mongoose.exports = mongoose.model('User', userScherma);