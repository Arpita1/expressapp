import request from 'supertest';
import app from '../src/app'; // Path to your exported Express app

// We describe the "Books API" test suite
describe('Books API', () => {
  
  // This test checks GET /books
  it('should return an array of books', async () => {
    const response = await request(app)
      .get('/books')      // Make GET request to /books
      .expect(200);       // Expect HTTP 200 (OK) 
      // (Using .expect(200) is one way, or you can use expect(response.status).toBe(200))

    // Now we can do deeper checks on response body
    expect(Array.isArray(response.body)).toBe(true);
    // If you have 2 initial books in memory, you might expect length >= 2
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  // This test checks POST /books
  it('should create a new book', async () => {
    const newBookData = {
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
    };

    const response = await request(app)
      .post('/books')        // Make POST request
      .send(newBookData)     // Send JSON body
      .expect(201);          // Expect HTTP 201 (Created)

    // The response body should have what we sent plus an auto-generated id
    expect(response.body.title).toBe('Fahrenheit 451');
    expect(response.body.author).toBe('Ray Bradbury');
    expect(response.body.id).toBeDefined(); // We set an 'id' in the route
  });

  // GET /books/:id
  it('should return a single book by ID', async () => {
    // We know from your in-memory array that book with ID 1 is '1984'
    const response = await request(app)
      .get('/books/1')
      .expect(200);

    expect(response.body.title).toBe('1984');
    expect(response.body.author).toBe('George Orwell');
  });

  // PUT /books/:id (updating a book)
  it('should update an existing book', async () => {
    const updatedData = { title: 'Animal Farm' };

    const response = await request(app)
      .put('/books/1')          // We'll update the book with id=1
      .send(updatedData)
      .expect(200);

    // Expect the title to have changed
    expect(response.body.title).toBe('Animal Farm');
    // The author remains from the old data
    expect(response.body.author).toBe('George Orwell');
  });

  // DELETE /books/:id
  it('should delete a book by ID', async () => {
    // We'll delete the book with ID=1
    const response = await request(app)
      .delete('/books/1')
      .expect(200);

    // The route responds with some message
    expect(response.body.message).toBe('Book deleted');
    expect(response.body.deleted).toBeDefined();  // The deleted book info

    // Now if we try GET /books/1, it should be 404
    const checkResponse = await request(app)
      .get('/books/1')
      .expect(404);
    
    expect(checkResponse.body.error).toBe('Book not found');
  });

});
