// Import required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Default is localhost, can change to cloud DB
  user: process.env.DB_USER || 'root', // Default is root, use your MySQL username
  password: process.env.DB_PASSWORD || 'root@123', // Your MySQL password
  database: process.env.DB_NAME || 'portfolio', // Your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// API route to handle contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // SQL query to insert the contact form data into the database
  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  
  db.execute(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  });
});

// Set up server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
