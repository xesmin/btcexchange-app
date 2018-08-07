import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import passportLocalMongoose from 'passport-local-mongoose';
import Database from '../controllers/databaseController';

const userSchema = new mongoose.Schema({
 id: Number,
 username: String,
 password: String,
 email: String,
 phone: String,
 name: String,
 lastname: String,
 documentId: String,
 verifiedEmail: Boolean,
 verifiedPhone: Boolean,
 verifiedId: Boolean,
 admin: Boolean
});

autoIncrement.initialize(Database);
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);