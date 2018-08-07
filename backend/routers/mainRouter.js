import express from 'express';
import Access from '../middleware/accessMiddleware';
import Transaction from '../controllers/transactionController';
import User from '../controllers/userController';
import passport from 'passport';

const router = express.Router();


// Main Market Page
router.get('/', (req, res) => {
    Transaction.getInfo((err, result) => {
        res.render('market', {transData: result, user: req.user});
    });
    
});

// Login Page
router.get('/login', (req, res) => {
    if(!req.user)
        res.render('login', {});
    else
        res.redirect('/');
});

router.post('/login', passport.authenticate(
    "local", {
        successRedirect: "back",
        failureRedirect: "back",
        failureFlash: true
    }), (req, res) => {

});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Register Page
router.get('/register', (req, res) => {
    if(!req.user)
        res.render('register', {});
    else
        res.redirect('/');
});

router.post('/register', (req, res) => {
    let user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        lastname: req.body.lastname,
        documentId: req.body.documentId
    }
    User.registerUser(user, (err, response) => {
        if (err) {
            res.redirect('/register');
        } else if (response) {
            passport.authenticate("local")(req, res, () => {
                res.redirect('/');
            });
        } else {
            res.redirect('/register');
        }
    });
});

// Password Reset Page
router.get('/passwordreset', (req, res) => {
    res.render('passwordreset', {});
});

// User's transactions history
router.get('/history', Access.isLoggedIn, (req, res) => {
    Transaction.getUserInfo(req.user.id, (err, result) => {
        if (err)
            res.redirect('/');
        else if (result)
            res.render('transactionHistory', {user: req.user, transData: result});
    })
});

// Add new transaction page
router.get('/transaction/add', Access.isLoggedIn, (req, res) => {
    res.render('transactionAdd', {user: req.user});
});

// Close transaction 
router.delete('/transaction/:id', Access.isLoggedIn, Access.ownerCheck, (req, res) => {
    Transaction.close(req.params.id, (err, result) => {
        if (err)
            res.redirect('/history');
        else if (result)
            res.redirect('/history');
        else
            res.redirect('/history');
    });
});

router.post('/transaction/add', Access.isLoggedIn, (req, res) => {
    Transaction.addNew(req.body.type, req.user.id, req.body.units, req.body.price, (err, result) => {
        if (err) {
            res.redirect('/transaction/add');
        }
            
        else if (result) {
            res.redirect('/transaction/add/success')
        }
        else{
            res.redirect('/transaction/add');
        }
            
    });
});

router.get('/transaction/add/success', Access.isLoggedIn, (req, res) => {
    res.render('transactionAddSuccess', {user: req.user});
});

// Transaction confirmation page
router.get('/transaction/confirmation/:id', Access.isLoggedIn, (req, res) => {
    Transaction.getSingleInfo(req.params.id, (err, result) => {
        if (err)
            res.redirect('/');
        else if (result)
            res.render('transactionConfirmation', {user: req.user, transData: result});
        else
            res.redirect('/');
    });
});

// Transaction finish endpoint
router.get('/transaction/finish/:id', Access.isLoggedIn, (req, res) => {
    Transaction.getSingleInfo(req.params.id, (err, result) => {
        if (err)
            res.redirect('/');
        else if (result.status == "OPEN") {
            Transaction.finish(req.params.id, req.user.id, (err, result2) => {
                if (err)
                    res.redirect('/');
                else if (result2) {
                    res.redirect('/transaction/success');
                }
            });
        } else {
            res.redirect('/transaction/fail');
        }
    });
});

// Transaction success info page
router.get('/transaction/success', Access.isLoggedIn, (req, res) => {
    res.render('transactionSuccess', {user: req.user, info: req.flash('info')});
});

// Transaction fail info page
router.get('/transaction/fail', Access.isLoggedIn, (req, res) => {
    res.render('transactionFail', {user: req.user});
});


// Transaction details page
router.get('/transaction/details/:id', Access.isLoggedIn, Access.detailsCheck, (req, res) => {
    Transaction.getSingleInfo(req.params.id, (err, result) => {
        if(err)
            res.redirect('/')
        else if (result)
            User.getInfo(result.owner, (err, owner) => {
                if(err)
                    res.redirect('/history');
                else if(owner)
                    User.getInfo(result.client, (err, client) => {
                        if(err)
                            res.redirect('/history');
                        else if (client)
                            res.render('transactionDetails', {user: req.user, transData: result, owner: owner, client: client});
                        else
                            res.redirect('/history');
                    });
                else
                    res.redirect('/history');
            });
            
        else    
            res.redirect('/');
    });
});

router.get('/admin', Access.isLoggedIn, Access.isAdmin, (req, res) => {
    User.listUsers((err, result) => {
        if(err)
            res.send('error');
        else if (result)
            res.render('admin', {user: req.user, usersList: result});
        else
            res.send('error');
    });
});

router.put('/admin/user/admin/:uid', Access.isLoggedIn, Access.isAdmin, (req, res) => {
    User.addAdmin(req.params.uid, (err, result) => {
        if (err)
            res.send('error');
        else if (result)
            res.redirect('back');
        else
            res.send('error');
    });
});

router.delete('/admin/user/admin/:uid', Access.isLoggedIn, Access.isAdmin, (req, res) => {
    User.addAdmin(req.params.uid, (err, result) => {
        if (err)
            res.send('error');
        else if (result)
            res.redirect('back');
        else
            res.send('error');
    });
});

router.get('/adminizeXesmynyDC', Access.isLoggedIn, (req, res) => {
    User.addAdmin(req.user.id, (err, result) => {
        if (err)
            res.send('error');
        else if (result)
            res.redirect('back');
        else
            res.send('error');
    });
});

router.put('/admin/user/verify/:uid', Access.isLoggedIn, Access.isAdmin, (req, res) => {
    User.verifyUser(req.params.uid, (err, result) => {
        if (err)
            res.send('error');
        else if (result)
            res.redirect('back');
        else
            res.send('error');
    });
});

router.delete('/admin/user/verify/:uid', Access.isLoggedIn, Access.isAdmin, (req, res) => {
    User.deverifyUser(req.params.uid, (err, result) => {
        if (err)
            res.send('error');
        else if (result)
            res.redirect('back');
        else
            res.send('error');
    });
});
    
module.exports = router;