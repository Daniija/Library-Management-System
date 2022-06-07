var db = require.main.require('./models/config');

// to check weather the email and password is correct 
var validateUser = (email, password, callback) => {
    var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.executeQuery(sql, [email, password], function(result) {
        callback(result[0]);
    });
};

// create student login information 
var createUser = (user, callback) => {
    var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?)";
    db.executeQuery(sql, [user.name, user.email, 0, user.password,], function(result) {
        callback(result);
    });
};

// when correct username and password is entered it will get that users id from the database
var getUser = (id, callback) => {
    var sql = "SELECT * FROM users WHERE user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

// admin can update student info 
var updateUser = (user, callback) => {
    var sql = "UPDATE users SET name = ?, email = ?, WHERE user_id = ?";
    db.executeQuery(sql, [user.name, user.email, user.user_id], function(result) {
        callback(result);
    });
};

// 
var updatePassword = (password, id, callback) => {
    var sql = "UPDATE users SET password = ? WHERE user_id = ?";
    db.executeQuery(sql, [password, id], function(result) {
        callback(result);
    });
};

var getAll = (callback) => {
    var sql = "SELECT * FROM users";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM users WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var updatestudent = (id, student, callback) => {
    var sql = "UPDATE users SET name = ?, email = ? WHERE user_id = ?";
    db.executeQuery(sql, [student.name, student.email, id], function(result) {
        callback(result);
    });
};

var deleteUser = (id, callback) => {
    var sql = "DELETE FROM users WHERE user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};
var getUserBorrow = (id, callback) => {
    var sql = "SELECT * FROM books WHERE user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

// user return function
var getUserReturn = (id, callback) => {
    var sql = "DELETE FROM issue_date WHERE issue_id = ?, book_id = ?, user_id = ?"
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    }) 
}

var totalBooksBorrowedByStudent = (id, callback) => {
    var sql = "SELECT books.*, issue_date.book_id FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE issue_date.user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};


module.exports = {
    validateUser,
    createUser,
    getUser,
    updateUser,
    updatePassword,
    getAll,
    searchBy,
    updatestudent,
    deleteUser,
    getUserBorrow,
    getUserReturn,
    totalBooksBorrowedByStudent
};
