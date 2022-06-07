var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/userModel');
var bookModel = require.main.require('./models/bookModel');
var validationRules = require.main.require('./validations/rules');
var asyncValidator = require('async-validator-2');

router.get('/home', (req, res)=> {
    // var users = "";
    userModel.getAll((users)=> {
        if(!users){
            res.send("Invalid");
        }
        else {
            bookModel.getAll((books)=> {
                if(!books){
                    res.send("Invalid");
                }
                else {
                    bookModel.getAllBorrowedBooks((borrowed)=> {
                        if(!borrowed){
                            res.send("invalid");
                        }
                        else {
                            bookModel.totalBorrowed30((mostBorrowed)=> {
                                if(!mostBorrowed){
                                    res.send("not valid");
                                }
                                else {
                                    bookModel.mostRequestedBook((mostRequested)=> {
                                        if(!mostRequested){
                                            res.render("nothing here");
                                        }
                                        else {
                                            bookModel.mostBorrowedBook((mostBorrowedBook)=> {
                                                if(!mostBorrowedBook){
                                                    res.send("no borrowed books");
                                                }
                                                else {
                                                    res.render('admin/home', {usr: users.length, bk: books.length, brwd: borrowed.length, mb: mostBorrowed.length, mrb: mostRequested, mbb: mostBorrowedBook});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });


});

router.get('/profile/edit', (req, res)=> {
    var admin = userModel.getUser(req.session.admin, (result)=> {
        if(!result){
            res.send("invalid");
        }
        else {
            console.log(result);
            res.render('admin/profile-edit', {res: result, errs: []});
        }
    });
});

router.post('/profile/edit', (req, res)=> {
    var rules = validationRules.users.update;
    var validator = new asyncValidator(rules);
    var data = {
      user_id: req.body.user_id,
      name: req.body.name,
      email: req.body.email
    };

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updateUser(data, (result)=> {
                if(!result){
                    res.send('invalid');
                }
                else {
                    res.redirect('/admin/profile');
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/profile-edit', {errs: errors, res: []});
        }
    });
});

router.get('/books', (req, res)=> {
    bookModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books', {res: result, errs: []});
        }
    });
});

router.post('/books', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    bookModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/books', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('admin/books', {res: result, errs: []})
        }
    });
});

router.get('/students', (req, res)=> {
    userModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/students', {res: result, errs: []});
        }
    });
});

router.post('/students', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    userModel.searchBy(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/students', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('admin/students', {res: result, errs: []})
        }
    });
});

router.get('/students/add', (req, res)=> {
    res.render('admin/students-add', {errs: [], success: [], data: []});
});

router.post('/students/add', (req, res)=> {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    var rules = validationRules.users.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.createUser(data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/students-add', {errs: [], success: [{message: "student added successfully!"}], data: []});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/students-add', {errs: errors, success: [], data});
        }
    });
});

router.get('/books/add', (req, res)=> {
    res.render('admin/books-add', {errs: [], success: [], data: []});
});

router.post('/books/add', (req, res)=> {
    var data = {
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author
    };

    var rules = validationRules.books.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.createBook(data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/books-add', {errs: [], success: [{message: "Book added successfully!"}], data: []});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/books-add', {errs: errors, success: [], data});
        }
    });
});

router.get('/books/edit/:id', (req, res)=> {
    var book = req.params.id;
    bookModel.getBook(book, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            res.render('admin/books-edit', {res: result, errs: [], success: []});
        }
    });
});

router.post('/books/edit/:id', (req, res)=> {
    var data = {
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author
    };
    var book_id = req.body.book_id;

    var rules = validationRules.books.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.updateBook(book_id, data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/books-edit', {res: result, errs:[], success: [{message: "Book updated successfully!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/books-edit', {res: data, errs: errors, success: []})
        }
    });

});

router.get('/students/edit/:id', (req, res)=> {
    var student = req.params.id;
    userModel.getUser(student, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            res.render('admin/students-edit', {res: result, errs: [], success: []});
        }
    });
});

router.post('/students/edit/:id', (req, res)=> {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    var student_id = req.body.user_id;

    var rules = validationRules.users.create;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            userModel.updatestudent(student_id, data, (result)=> {
                if(!result){
                    res.send("Invalid");
                }
                else {
                    console.log(result);
                    res.render('admin/students-edit', {res: result, errs:[], success: [{message: "Student updated successfully!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('admin/students-edit', {res: data, errs: errors, success: []});
        }
    });

});

router.get('/students/profile/:id', (req, res)=> {
    var id = req.params.id;
    var student = userModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/students-profile', {res: result});
        }
    });
});

router.get('/students/delete/:id', (req, res)=> {
    var id = req.params.id;
    var student = userModel.getUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/students-delete', {res: result});
        }
    });
});

router.post('/students/delete/:id', (req, res)=> {
    var id = req.body.user_id;
    var student = userModel.deleteUser(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.redirect('/admin/students');
        }
    });
});

router.get('/books/delete/:id', (req, res)=> {
    var id = req.params.id;
    var book = bookModel.getBook(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books-delete', {res: result});
        }
    });
});

router.post('/books/delete/:id', (req, res)=> {
    var id = req.body.book_id;
    var book = bookModel.deleteBook(id, (result)=> {
        if(result.length == 0){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.redirect('/admin/books');
        }
    });
});

router.get('/books/:id/issue', (req, res)=> {
    userModel.getAll((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books-issue', {res: result, errs: [], success: []});
        }
    });
});

router.post('/books/:id/issue', (req, res)=> {
    var book_id = req.params.id;
    var student_id = req.body.user_id;

    bookModel.booksIssuedBystudent(student_id, (books)=> {
        if(!books){
            res.send("Invalid");
        }
        else {
            console.log(books.length);
            if(books.length <= 2){
                bookModel.setIssueDate(book_id, student_id, (result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        console.log(result);
                    }
                });
                bookModel.issueBook(book_id, student_id, (result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        console.log(result);
                        res.redirect('/admin/books');
                    }
                });
            }
            else{
                userModel.getAll((result)=> {
                    if(!result){
                        res.send("Invalid");
                    }
                    else {
                        console.log(result);
                        res.render('admin/books-issue', {res: result, errs: [{message: "This student has already issued 3 books, please unissue one first!"}], success: []});
                    }
                });
            }
        }
    });
});

router.get('/books/issued', (req, res)=> {
    bookModel.getAll((result)=> {
        if(!result){
            res.send("Invalid!");
        }
        else {
            console.log(result);
            res.render('admin/issued-books', {res: result});
        }
    });
});

router.post('/books/issued', (req, res)=> {
    var book_id = req.body.book_id;
    bookModel.unissueBook(book_id, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.redirect('/admin/books');
        }
    });
});

router.get('/books/requested', (req, res)=> {
    bookModel.getRequestedBooks((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('admin/books-requested', {res: result, errs: []});
        }
    });
});

router.post('/books/requested', (req, res)=> {
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    bookModel.bookRequestSearch(searchBy, word, (result)=> {
        if(!result){
            res.render('admin/books-requested', {res: [], errs: [{message: "No results found!"}]});
        }
        else {
            console.log(result);
            res.render('admin/books-requested', {res: result, errs: []})
        }
    });
});



module.exports = router;
