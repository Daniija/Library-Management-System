var db = require.main.require('./models/config');

var getAll = (callback) => {
    var sql = "SELECT * FROM books";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM books WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var createBook = (book, callback) => {
    var date = new Date();
    var sql = "INSERT INTO books VALUES(null, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [0, book.genre, book.title, book.author, date], function(result) {
        callback(result);
    });
};

var getBook = (id, callback) => {
    var sql = "SELECT * FROM books WHERE book_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updateBook = (id, book, callback) => {
    var sql = "UPDATE books SET genre = ?, title = ?, author = ? WHERE book_id = ?";
    db.executeQuery(sql, [book.genre, book.title, book.author, id], function(result) {
        callback(result);
    });
};

var deleteBook = (id, callback) => {
    var sql = "DELETE FROM books WHERE book_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

var issueBook = (book_id, student_id, callback) => {
    var date = new Date();
    var sql = "UPDATE books SET user_id = ?, date_issued = ? WHERE book_id = ?";
    db.executeQuery(sql, [student_id, date, book_id], function(result) {
        callback(result);
    });
};

var unissueBook = (book_id, callback) => {
    var sql = "UPDATE books SET user_id = '', date_issued = '' WHERE book_id = ?";
    db.executeQuery(sql, [book_id], function(result) {
        callback(result);
    });
};

var getIssuedBooks = (id, callback) => {
    var sql = "SELECT * FROM books WHERE NOT user_id = ''";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var getUnborrowedBooks = (callback) => {
    var sql = "SELECT * FROM books WHERE (user_id = 'NULL') OR (user_id = 0)";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var bookRequest = (student_id, book, callback) => {
    var date = new Date();
    var sql = "INSERT INTO books_request VALUES(null, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [student_id, book.genre, book.title, book.author, date], function(result) {
        callback(result);
    });
};

var studentsSearch = (searchBy, word, callback) => {
    var sql = "(SELECT * FROM books WHERE "+searchBy+" = ?) AND ((user_id = '') OR (user_id = 0))";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var getRequestedBooks = (callback) => {
    var sql = "SELECT * FROM books_request";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var bookRequestSearch = (searchBy, word, callback) => {
    var sql = "SELECT * FROM books_request WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var setIssueDate = (book_id, student_id, callback) => {
    var date = new Date();
    var sql = "INSERT INTO issue_date VALUES(null, ?, ?, ?)";
    db.executeQuery(sql, [book_id, student_id, date], function(result) {
        callback(result);
    });
};

var booksIssuedBystudent = (student_id, callback) => {
    var sql = "SELECT * FROM books WHERE user_id = ?";
    db.executeQuery(sql, [student_id], function(result) {
        callback(result);
    });
};

var getAllBorrowedBooks = (callback) => {
    var sql = "SELECT * FROM issue_date";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var totalBorrowed30 = (callback) => {
    var result = new Date();
    var newDate = result.setDate(result.getDate() + 30);
    var sql = "SELECT books.*, issue_date.book_id FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE (date BETWEEN ? AND ?)";
    db.executeQuery(sql, [newDate, result], function(result) {
        callback(result);
    });
};

var mostBorrowedBook = (callback) => {
    var sql = "SELECT books.*, issue_date.book_id, COUNT(*) AS magnitude FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id GROUP BY books.title ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

var mostRequestedBook = (callback) => {
    var sql = "SELECT *, COUNT(*) AS magnitude FROM books_request GROUP BY isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

// SELECT books.*, issue_date.book_id, COUNT(*) AS magnitude FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE (date BETWEEN '2018-07-10' AND '2018-08-10') GROUP BY books.isbn ORDER BY magnitude DESC LIMIT 1


module.exports = {
    getAll,
    searchBy,
    createBook,
    getBook,
    updateBook,
    deleteBook,
    issueBook,
    unissueBook,
    getIssuedBooks,
    getUnborrowedBooks,
    bookRequest,
    studentsSearch,
    getRequestedBooks,
    bookRequestSearch,
    setIssueDate,
    booksIssuedBystudent,
    getAllBorrowedBooks,
    totalBorrowed30,
    mostRequestedBook,
    mostBorrowedBook
};
