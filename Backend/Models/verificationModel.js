const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const verifictionSchema = new mongoose.Schema({
    email: {
        requried:true,
        type: String
    },
    code: {
        requried: true,
        type: String
    },
})

verifictionSchema.pre('save', async function (next) {
    const verification = this;
    if (verification.isModified('code')) {
        verification.code = await bcrypt.hash(verification.code, 10);
    }
    next();
});
module.exports = mongoose.model('verification', verifictionSchema);