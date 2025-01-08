"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
//import morgan from 'morgan';
var morgan_1 = __importDefault(require("morgan"));
var app = (0, express_1.default)();
var PORT = 3000;
/* 1) Body Parsing Middleware */
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Our "database" for now: just an array in memory
var books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'Brave New World', author: 'Aldous Huxley' },
];
app.post('/books', function (req, res) {
    // The new book data should come in the JSON body
    var newBook = req.body;
    // Example: { title: 'Fahrenheit 451', author: 'Ray Bradbury' }
    // Generate a new ID (simple approach: 1 more than the last book’s id)
    // This is not a perfect approach, but it’s enough for a demo:
    var newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    newBook.id = newId;
    // Push into our array
    books.push(newBook);
    // Send back the newly created book as a response
    res.status(201).json(newBook);
});
app.get('/books', function (req, res) {
    // Just send back the entire books array
    res.json(books);
});
app.get('/books/:id', function (req, res) {
    // The path parameter is named 'id'
    // By default, it’s a string. We might convert it to a number:
    var bookId = parseInt(req.params.id, 10);
    // Find the book in our array
    var book = books.find(function (b) { return b.id === bookId; });
    if (!book) {
        // Book not found
        res.status(404).json({ error: 'Book not found' });
    }
    // Book found
    res.json(book);
});
app.put('/books/:id', function (req, res) {
    var bookId = parseInt(req.params.id, 10);
    // The updated data is in req.body (e.g., { title: "New Title", author: "New Author" })
    var updatedData = req.body;
    // Find the index of the book in the array
    var index = books.findIndex(function (b) { return b.id === bookId; });
    if (index === -1) {
        res.status(404).json({ error: 'Book not found' });
    }
    // Update the book info. We keep the same id.
    books[index] = __assign(__assign({}, books[index]), updatedData);
    // Send the updated book
    res.json(books[index]);
});
app.delete('/books/:id', function (req, res) {
    var bookId = parseInt(req.params.id, 10);
    var index = books.findIndex(function (b) { return b.id === bookId; });
    if (index === -1) {
        res.status(404).json({ error: 'Book not found' });
    }
    // Remove the book from the array
    var deletedBook = books.splice(index, 1)[0]; // splice returns an array
    res.json({ message: 'Book deleted', deleted: deletedBook });
});
/* 2) GET Route at '/' */
app.get('/', function (req, res) {
    res.send('Hello from Express + TypeScript!');
});
/* 3) GET Route at '/about' */
app.get('/about', function (req, res) {
    res.send('This is the About page.');
});
/* 4) GET with Query Params */
app.get('/greet', function (req, res) {
    var name = req.query.name || 'stranger';
    res.send("Hello, ".concat(name, "!"));
});
/* 5) POST Route at '/submit' */
app.post('/submit', function (req, res) {
    var receivedData = req.body;
    console.log('Received data:', receivedData);
    res.json({
        message: 'Data received!',
        received: receivedData
    });
});
// Put this AFTER your routes, near the bottom:
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Something went wrong!');
});
/* 6) Start the server */
app.listen(PORT, function () {
    console.log("Server is running at http://localhost:".concat(PORT));
});
