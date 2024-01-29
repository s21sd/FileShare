const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const fileSchema = new mongoose.Schema({
    senderemail: {
        required: true,
        type: String
    },
    reciveremail: {
        type: String,
        required: true,
    },
    fileurl: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    sharedAt: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg',
        required: true,
    },
    files: {
        type: [fileSchema],
        default: []
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
