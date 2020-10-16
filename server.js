/*
// --> res = database.users
// signin --> POST = success/fail
// register --> POST = user
// profile/:userId --> GET = user
// image --> PUT --> user
*/
const express = require('express'); // express.js
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');  // for hash
const cors = require('cors');
const knex = require('knex'); // for Postgres database
const { response } = require('express');

const register = require('./controllers/register')
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});


const app = express();


app.use(bodyParser.json());
app.use(cors());


// --> response 'success'
app.get('/', (req, res)=> { // request, response
  res.send('success');
})

// signin --> POST = success/fail
// Enable users to signin with correct
// email and password stored in our postgresql
// database.
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

// register --> POST = user
// add a new user into database
// if the user already exists, error message
// will be sent
app.post('/register', (req, res) => { register.handleRegister(req,res,db,bcrypt)});

// profile/:userId --> GET = user
// develop user profile page for each
// user. It is not very useful now for this
// application.
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req,res,db)});

// image --> PUT(update) --> user
// Update user entries and increase
// the counts.
app.put('/image', (req,res) => { image.handleImage(req,res,db)});


app.listen(3001, () => {
  console.log('app is running on port 3001');
})

