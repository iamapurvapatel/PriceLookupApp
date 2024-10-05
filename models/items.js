const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    Name: String,
    Barcode: Number,
    Price: String
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;