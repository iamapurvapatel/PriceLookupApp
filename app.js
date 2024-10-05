const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/items');

const app = express();
const PORT = 3000;

// Set strictQuery to false to avoid the warning
mongoose.set('strictQuery', false); // Suppresses the deprecation warning

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/priceLookupDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Home Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API Route to Lookup Item by Name or Barcode
app.post('/lookup', async(req, res) => {
    let searchTerm = req.body.searchTerm;

    console.log('Search Term:', searchTerm);

    // Attempt to convert the search term to a number if it seems numeric
    const isNumeric = !isNaN(searchTerm);
    let barcode = isNumeric ? parseInt(searchTerm) : null; // Convert to a number if numeric

    console.log('Is Numeric:', isNumeric);
    console.log('Converted Barcode:', barcode);

    try {
        // Construct the query
        const query = {
            $or: [
                    { Name: { $regex: searchTerm, $options: 'i' } }, // Search by name using regex
                    isNumeric ? { Barcode: barcode } : null // Only search by barcode if it's numeric
                ].filter(Boolean) // Remove any null values from the array
        };

        console.log('Searching for:', query);

        const item = await Item.findOne(query);

        if (item) {
            console.log('Item found:', item);
            res.json({ success: true, item });
        } else {
            console.log('Item not found');
            res.json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        console.log('Error occurred:', error);
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
});






app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});