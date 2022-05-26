var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/userModel');
var bookModel = require.main.require('./models/bookModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/home', (req, res)=> {
    userModel.totalBooksBorrowedByStudent(req.session.students, (booksBorrowed)=> {
        if(!booksBorrowed){
            res.send("nothing here");
        }
        else {
            res.render('students/home', {tbbbc: booksBorrowed.length});
        }
    });
});

router.get('/profile', (req, res)=> {
    var students = userModel.getUser(req.session.students, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('students/profile', {res: result});
        }
    });
});

router.get('/profile/edit', (req, res)=> {
    var students = userModel.getUser(req.session.students, (result)=> {
        if(!result){
            res.send("invalid");
        }
        else {
            console.log(result);
            res.render('students/profile-edit', {res: result, errs: []});
        }
    });
});

router.post('/profile/edit', (req, res)=> {
    var rules = validationRules.users.update;
    var validator = new asyncValidator(rules);
    var data = {
      user_id: req.body.user_id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender
    };

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updateUser(data, (result)=> {
                if(!result){
                    res.send('invalid');
                }
                else {
                    res.redirect('/students/profile');
                }
            });
        }
        else {
            console.log(fields);
            res.render('students/profile-edit', {errs: errors, res: []});
        }
    });
});

router.get('/changepass', (req, res)=> {
    var students = userModel.getUser(req.session.students, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('students/change-password', {res: result, errs: [], success: []});
        }
    });
});

router.post('/changepass', (req, res)=> {
    var rules = validationRules.users.changePassword;
    var validator = new asyncValidator(rules);
    var data = {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword
    };

    if(req.body.password == req.body.oldPassword){
        validator.validate(data, (errors, fields)=> {
            if(!errors){
                if(req.body.newPassword == req.body.confirmPassword){
                    userModel.updatePassword(req.body.newPassword, req.body.user_id, (result)=> {
                        if(!result){
                            res.send('invalid');
                        }
                        else {
                            res.render('students/change-password', {errs:[], res: [], success: [{message: "Password changed successfully"}]});
                        }
                    });
                }
                else {
                    res.render('students/change-password', {errs:[{message: "Your new passwords don't match!"}], res: [], success: []});
                }
            }
            else {
                console.log(fields);
                res.render('students/change-password', {errs: errors, res: [], success: []});
            }
        });
    }
    else {
        res.render('students/change-password', {errs: [{message: "Your old passsword does not match!"}], res: [], success: []});
    }

});

router.get('/books', (req, res)=> {
    bookModel.getUnborrowedBooks((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('students/books', {res: result, errs: []});
        }
    });
});

router.post('/books', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    bookModel.studentsSearch(searchBy, word, (result)=> {
        if(!result){
            res.render('students/books', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('students/books', {res: result, errs: []})
        }
    });
});


router.get('/books/borrowed', (req, res)=> {
    userModel.getUserBorrow(req.session.students, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('students/borrowed-books', {res: result});
        }
    });
});

router.get('/books/request', (req, res)=> {
    res.render('students/books-request', {errs: [], success: []});
});

router.post('/books/request', (req, res)=> {
    var data = {
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author,
        edition: req.body.edition,
        isbn: req.body.isbn
    };

    var rules = validationRules.books.request;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.bookRequest(req.session.students, data, (result)=> {
                if(result.length == 0){
                    res.send("Invalid");
                }
                else {
                    res.render('students/books-request', {errs: [], success: [{message: "Your request has been noted, thank you!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('students/books-request', {errs: errors, success: []});
        }
    });
});
router.get('/books/history', (req, res)=> {
    userModel.getUserHistory(req.session.students, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('students/borrow-history', {res: result});
        }
    });
});



module.exports = router;
