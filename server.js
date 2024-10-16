const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// Serve static files (e.g., images, CSS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Array of strings (books)
let books = ['The Hobbit', '1984', 'To Kill a Mockingbird', 'Moby Dick', 'Pride and Prejudice'];

// Set the port for the server
const PORT = 8080;

// Serve the instructions HTML file (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// API Endpoints

// GET /api/items
// Description: Get all items (books)
// Task: Implement logic to return the full list of books
app.get('/api/items', (req, res) => {

  res.status(200).json(books);

});

// GET /api/items?title=[<<partial title name>>]
// Description: Search for books by partial title match
// Task: Implement logic to return books matching the partial title
app.get('/api/items/search', (req, res) => {
  
  const titleQuery = req.query.title;

  if (!titleQuery) {
    // If no title is provided in the query, return an error
    return res.status(400).send('Please provide a title to search.');
  }

  // Filter books that contain the partial title
  const filteredBooks = books.filter(book =>
    book.toLowerCase().includes(titleQuery.toLowerCase())
  );

  // If no books match, return an empty array
  res.status(200).json(filteredBooks);

});

// GET /api/items/:id
// Description: Get a specific item by ID
// Task: Implement logic to return a book by its index (ID)
app.get('/api/items/:id', (req, res) => {
  
  // Get the 'id' from the URL and convert it to an integer
  const id = parseInt(req.params.id, 10);   
  
  // Check if the 'id' is within the bounds of the books array
  if (id >= 0 && id < books.length) {
    res.status(200).json(books[id]);
  } else {
    res.status(404).send('Book not found');
  }

});

// POST /api/items
// Description: Add a new item
// Task: Implement logic to add a new book to the array
app.post('/api/items', (req, res) => {

  const { title } = req.body; // Extract the 'title' from the request body

  // Check if the title exists and is not an empty string
  if (!title || title.trim() === '') {
    return res.status(400).send('Title is required and cannot be empty.');
  }

  // Add the new book to the books array
  books.push(title);

  // Return a success response with the updated list of books
  res.status(201).json({
    message: 'Book added successfully',
    books: books
  });

});

// PUT /api/items/:id
// Description: Update an item by ID
// Task: Implement logic to update a book by its index (ID)
app.put('/api/items/:id', (req, res) => {

  // Get the ID from the URL and convert it to an integer
  const id = parseInt(req.params.id, 10); 

  // Get the new title from the request body
  const { title } = req.body;

  // Validate the ID and check if the ID is within the array bounds
  if (id >= 0 && id < books.length) {
    // Validate that the title is provided and not an empty string
    if (!title || title.trim() === '') {
      return res.status(400).send('Title is required and cannot be empty.');
    }

    // Update the book at the given index
    books[id] = title;

    // Return a success response with the updated list of books
    res.status(200).json({
      message: 'Book updated successfully',
      books: books
    });
  } else {
    // If the ID is out of bounds, return a 404 error
    res.status(404).send('Book not found');
  }

});

// DELETE /api/items/:id
// Description: Remove an item by ID
// Task: Implement logic to remove a book by its index (ID)
app.delete('/api/items/:id', (req, res) => {
  
  // Get the ID from the URL and convert it to an integer
  const id = parseInt(req.params.id, 10); 

  // Validate the ID to check if it is within the bounds of the books array
  if (id >= 0 && id < books.length) {
    // Remove the book from the array
    const removedBook = books.splice(id, 1);

    // Return a success response with the removed book and the updated list of books
    res.status(200).json({
      message: 'Book removed successfully',
      removedBook: removedBook[0],
      books: books
    });
  } else {
    // If the ID is out of bounds, return a 404 error
    res.status(404).send('Book not found');
  }

});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
