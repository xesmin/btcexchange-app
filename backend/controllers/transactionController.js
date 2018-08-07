import Transaction from '../models/transactionModel';

var exports = module.exports = {};

exports.addNew = (type, owner, units, price, callback) => {
    var newTrans = new Transaction({
        type: type,
        owner: owner,
        units: units,
        price: price,
        status: "OPEN"
    });

    newTrans.save((err) => {
        if (err)
            callback(err, null);
        else
            callback(null, true);
    });
}

exports.getSingleInfo = (tid, callback) => {
    Transaction.findOne({
        id: tid
    }, (err, res) => {
        if (err)
            callback(true, null);
        else if (res)
            callback(null, res);
        else
            callback(true, null);
    });
}

exports.getInfo = (callback) => {
    Transaction.find({}, (err, res) => {
        if (err)
        callback(true, null);
    else if (res)
        callback(null, res);
    else
        callback(true, null);
    });
}

exports.getUserInfo = (uid, callback) => {
    Transaction.find({
        $or: [{
            owner: uid
        }, {
            client: uid
        }]
    }, (err, res) => {
        if (err)
            callback(true, null);
        else if (res)
            callback(null, res);
        else
            callback(true, null);
    });
}

exports.close = (tid, callback) => {
    Transaction.findOneAndUpdate({
        id: tid
    }, {
        status: "CLOSED"
    }, {
        new: true
    }, (err) => {
        if (err)
            callback(true, null);
        else
            callback(null, true);
    });
}

exports.finish = (tid, client, callback) => {
    Transaction.findOneAndUpdate({
        id: tid
    }, {
        client: client,
        status: "FINISHED"
    }, {
        new: true
    }, (err) => {
        if (err)
            callback(true, null);
        else
            callback(null, true);
    });
}