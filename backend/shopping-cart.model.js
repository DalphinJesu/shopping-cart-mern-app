const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ShoppingCart = new Schema({
    product_name: {
        type: String
    },
    product_quantity: {
        type: Number
    },
    product_price: {
        type: Number
    }
});

module.exports = mongoose.model('ShoppingCart', ShoppingCart);