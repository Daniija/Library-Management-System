var db = require.main.require('./models/config');

var validateUser = (email, password, callback) => {
    var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.executeQuery(sql, [email, password], function(result) {
        callback(result[0]);
    });
};

var createUser = (user, callback) => {
    var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?)";
    db.executeQuery(sql, [user.name, user.email, 0, user.password,], function(result) {
        callback(result);
    });
};

var getUser = (id, callback) => {
    var sql = "SELECT * FROM users WHERE user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updateUser = (user, callback) => {
    var sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [user.name, user.email, user.phone, user.address, user.gender, user.user_id], function(result) {
        callback(result);
    });
};

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
    var sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [student.name, student.email, student.phone, student.address, student.gender, id], function(result) {
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
var getUserHistory = (id, callback) => {
    var sql = "SELECT issue_date.user_id, issue_date.book_id, books.title, books.author, books.publisher, books.edition, books.isbn, issue_date.date FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE issue_date.user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

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
    getUserHistory,
    totalBooksBorrowedByStudent
};
