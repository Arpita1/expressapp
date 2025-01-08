import express from 'express';
//import morgan from 'morgan';


const app = express();
const PORT = 3000;

/* 1) Body Parsing Middleware */
app.use(express.json());
//app.use(morgan('dev'));

// Our "database" for now: just an array in memory
let books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'Brave New World', author: 'Aldous Huxley' },
];

app.post('/books', (req, res) => {
    // The new book data should come in the JSON body
    const newBook = req.body; 
    // Example: { title: 'Fahrenheit 451', author: 'Ray Bradbury' }
  
    // Generate a new ID (simple approach: 1 more than the last book’s id)
    // This is not a perfect approach, but it’s enough for a demo:
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    newBook.id = newId;
  
    // Push into our array
    books.push(newBook);
  
    // Send back the newly created book as a response
    res.status(201).json(newBook);
});

app.get('/books', (req, res) => {
    // Just send back the entire books array
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    // The path parameter is named 'id'
    // By default, it’s a string. We might convert it to a number:
    const bookId = parseInt(req.params.id, 10);
  
    // Find the book in our array
    const book = books.find(b => b.id === bookId);
  
    if (!book) {
      // Book not found
      res.status(404).json({ error: 'Book not found' });
    }
  
    // Book found
    res.json(book);
});

app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    // The updated data is in req.body (e.g., { title: "New Title", author: "New Author" })
    const updatedData = req.body;
  
    // Find the index of the book in the array
    const index = books.findIndex(b => b.id === bookId);
  
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
    }
  
    // Update the book info. We keep the same id.
    books[index] = { ...books[index], ...updatedData };
  
    // Send the updated book
    res.json(books[index]);
});

app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    const index = books.findIndex(b => b.id === bookId);
  
    if (index === -1) {
    res.status(404).json({ error: 'Book not found' });
    }
  
    // Remove the book from the array
    const deletedBook = books.splice(index, 1)[0]; // splice returns an array
    res.json({ message: 'Book deleted', deleted: deletedBook });
  });
  



  
/* 2) GET Route at '/' */
app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript!');
});

/* 3) GET Route at '/about' */
app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

/* 4) GET with Query Params */
app.get('/greet', (req, res) => {
  const name = req.query.name || 'stranger';
  res.send(`Hello, ${name}!`);
});

/* 5) POST Route at '/submit' */
app.post('/submit', (req, res) => {
  const receivedData = req.body;
  console.log('Received data:', receivedData);
  res.json({
    message: 'Data received!',
    received: receivedData
  });
});



// Put this AFTER your routes, near the bottom:
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Something went wrong!');
});

// /* 6) Start the server */
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

export default app;
