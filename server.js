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


// --> res = this is working
app.get('/', (req, res)=> { // request, response
  res.send('success');
})

// signin --> POST = success/fail
// Enable users to signin with correct
// email and password stored in our postgresql
// database.
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credential'));
})

// register --> POST = user
// add a new user into database
// if the user already exists, error message
// will be sent
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginemail => {
        return trx('users')
        .returning('*')
        .insert({
          email: loginemail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)  // in case anything fails
    })
    .catch(err => res.status(400).json('unable to register'))
})

// profile/:userId --> GET = user
// develop user profile page for each
// user. It is not very useful now for this
// application.
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      console.log(user);
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('not found');
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

// image --> PUT(update) --> user
// Update user entries and increase
// the counts.
app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})


app.listen(3001, () => {
  console.log('app is running on port 3001');
})

