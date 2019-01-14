const mongoose = require('mongoose');
const encryption = require('../utilities/encryption');

let userSchema = new mongoose.Schema({
    username: { type: mongoose.SchemaTypes.String, required: 'Username is required!', unique: true },
    password: { type: mongoose.SchemaTypes.String, required: 'Password is required!' },
    salt: { type: mongoose.SchemaTypes.String, required: true },
    rentedCars: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Car' }],
    roles: [{ type: mongoose.SchemaTypes.String }]
});

userSchema.method({
    authenticate: function (password) {
        let hashedPassword = encryption.generateHashedPassword(this.salt, password);

        if (hashedPassword === this.password) {
            return true;
        }

        return false;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.seedAdminUser = () => {
    User.find({ username: 'admin' }).then(users => {
        if (users.length === 0) {
            let salt = encryption.generateSalt();
            let hashedPass = encryption.generateHashedPassword(salt, 'admin');

            User.create({
                username: 'admin',
                salt: salt,
                password: hashedPass,
                roles: ['Admin']
            });
        }
    });
};