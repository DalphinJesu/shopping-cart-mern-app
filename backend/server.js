const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shoppingRoutes = express.Router();
const PORT = 4000;

let ShoppingCart = require('./shopping-cart.model');
let ShoppingUsers = require('./shopping-cart-users.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://dalphin:test@shopping-cart-vbd5y.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

shoppingRoutes.route('/').get(function(req, res) {
    ShoppingCart.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

shoppingRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    ShoppingCart.findById(id, function(err, todo) {
        res.json(todo);
    });
});



shoppingRoutes.route('/users').get(function(req, res) {
    ShoppingUsers.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

/*shoppingRoutes.route('/:mobileNumber').get(function(req, res) {
    let mobileNo = req.params.mobile_number;
    ShoppingUsers.findById(mobileNo, function(err, todo) {
        res.json(todo);
    });
});*/

shoppingRoutes.route('/delete/:id').delete(function(req, res) {
    ShoppingCart.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.deleteOne({ _id: req.params.id});
            todo.save().then(todo => {
                res.json('Deleted successfully!');
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
            });
    });
});


shoppingRoutes.route('/update/:id').post(function(req, res) {
    ShoppingCart.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.product_name = req.body.product_name;
            todo.product_quantity = req.body.product_quantity;
            todo.product_price = req.body.product_price;

            todo.save().then(todo => {
                res.json('Product updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

shoppingRoutes.route('/add-product').post(function(req, res) {
    let todo = new ShoppingCart(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'Shopping DB': 'Product added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new product failed');
        });
});

app.use('/shopping-db', shoppingRoutes);


app.listen(PORT, function(){
    console.log("Server is running on PORT ::::: ", PORT);
});