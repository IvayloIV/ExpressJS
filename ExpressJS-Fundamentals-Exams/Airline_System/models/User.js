const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    email: { type: mongoose.Schema.Types.String, required: [true, 'Email is required!'], unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    name: { type: mongoose.Schema.Types.String, required:  [true, 'Name is required!'] },
    roles: [{ type: mongoose.Schema.Types.String, default: [] }]
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
            email: 'Admin',
            name: 'Gosho Goshov',
            salt,
            hashedPass,
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
