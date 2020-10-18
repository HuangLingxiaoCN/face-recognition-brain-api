
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

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => { register.handleRegister(req,res,db,bcrypt)});
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req,res,db)});
app.put('/image', (req,res) => { image.handleImage(req,res,db)});
app.post('/imageurl', (req,res) => { image.handleApiCall(req,res)});

app.listen(process.env.PORT || 3001, () => {
  console.log('app is running on port `${process.env.PORT}`');
})