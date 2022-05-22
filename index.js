const express = require('express')
const colors = require('colors')
morgan = require('morgan')
const dotenv = require('dotenv').config()

// Mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');

// Models
const Movies = Models.Movie;
const Users = Models.User;

// Auth
const passport = require('passport');
require('./passport');

// Validation
const { check, validationResult } = require('express-validator');

const res = require('express/lib/response');

const app = express()

// Connect to Mongo
const connectDB = require('./config/db')
connectDB()

// CORS
const cors = require('cors');
//allow requests from all domains
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors({
    origin: '*'
}))

let auth = require('./auth')(app);

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Movie Share'})
})

//express.static (to get the documentation file)
app.use(express.static('public'));

//get list of all movies (json)
app.get('/movies', 
  passport.authenticate('jwt', { session: false }), 
  function (req, res) {
    Movies.find()
      .then(function (movies) {
        res.status(201).json(movies);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

app.get('/users', (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});



// Serve app
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))