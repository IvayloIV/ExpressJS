const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: [true, 'Username is require!'], unique: true },
    email: { type: mongoose.Schema.Types.String, required: [true, 'Email is require!'], unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    role: { type: mongoose.Schema.Types.String, enum: ['User', 'Admin'], default: 'User' },
    followedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel', default: [] }]
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, 'Admin');
        return User.create({
            username: 'Admin',
            email: 'admin@abv.bg',
            salt,
            hashedPass,
            role:'Admin'
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;