/*
// --> res = database.users
// signin --> POST = success/fail
// register --> POST = user
// profile/:userId --> GET = user
// image --> PUT --> user
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const bcrypt = require('bcrypt-nodejs');


const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      password: 'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      password: 'bananas',
      email: 'sally@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.use(bodyParser.json());
app.use(cors());


// --> res = this is working
app.get('/', (req, res)=> { // request, response
  res.send(database.users);
})

// signin --> POST = success/fail
app.post('/signin', (req, res) => {
  if (res.json(database.users[0])) {
        res.json('success');
      } else {
        res.status(400).json('error logging in');
      }
})

// register --> POST = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length-1]);
})

// profile/:userId --> GET = user
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('no found');
  }
})

// image --> PUT(update) --> user
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('no found');
  }
})



app.listen(3001, () => {
  console.log('app is running on port 3001');
})

