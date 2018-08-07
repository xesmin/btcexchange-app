import User from '../models/userModel';

var exports = module.exports = {};

exports.registerUser = (user, callback) => {
    User.findOne({
        email: user.email
    }, (err, res) => {
        if (res) {
            callback('EmailInUse', null);
        } else {
            User.register(new User({
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    name: user.name,
                    lastname: user.lastname,
                    documentId: user.documentId,
                    verifiedEmail: false,
                    verifiedPhone: false,
                    verifiedId: false
                }),
                user.password,
                (err, user) => {
                    if (err) {
                        callback(err.name, null);
                    } else {
                        callback(null, true);
                    }
            });
        }
    });
};

exports.verifyUser = (uid, callback) => {
    User.findOneAndUpdate({id: uid}, {verifiedEmail: true}, {new: true}, (err, res) => {
        if (err)
            callback(err, null);
        else
            callback(null, true);
    });
}

exports.deverifyUser = (uid, callback) => {
    User.findOneAndUpdate({id: uid}, {verifiedEmail: false}, {new: true}, (err, res) => {
        if (err)
            callback(err, null);
        else
            callback(null, true);
    });
}

exports.addAdmin = (uid, callback) => {
    User.findOneAndUpdate({id: uid}, {admin: true}, {new: true}, (err, res) => {
        if (err)
            callback(err, null);
        else
            callback(null, true);
    });
}

exports.removeAdmin = (uid, callback) => {
    User.findOneAndUpdate({id: uid}, {admin: false}, {new: true}, (err, res) => {
        if (err)
            callback(err, null);
        else
            callback(null, true);
    });
}

exports.getInfo = (uid, callback) => {
    User.findOne({id: uid}, (err, res) => {
        if (err)
            callback(true, null)
        else if (res)
            callback(null, res)
        else
            callback(true, null)
    })
};

exports.listUsers = (callback) => {
    User.find((err, res) => {
        if (err)
            callback(true, null);
        else if (res)
            callback(null, res);
        else
            callback(true, null);
    });
}
