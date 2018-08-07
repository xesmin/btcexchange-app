import Transaction from '../controllers/transactionController';

var exports = module.exports = {};

/// Login chceck
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

exports.isAdmin = (req, res, next) => {
    if(req.user.admin) {
        return next();
    }
    res.redirect('/');
}

exports.ownerCheck = (req, res, next) => {
    Transaction.getSingleInfo(req.params.id, (err, result) => {
        if (err)
            res.redirect('/');
        else if (result) {
            if (result.owner == req.user.id)
                return next();
            else
                res.redirect('/');
        } else
            res.redirect('/');
    })
}

exports.detailsCheck = (req, res, next) => {
    Transaction.getSingleInfo(req.params.id, (err, result) => {
        if (err)
            res.redirect('/');
        else if (result) {
            if (result.owner == req.user.id || result.client == req.user.id)
                return next();
            else
                res.redirect('/');
        } else
            res.redirect('/');
    });
}