const express = require("express");
//const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "danialfaizsal",
    password: "sb123",
    database: "smart-brain",
  },
});

const app = express();

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "johndoe@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sallydoe@gmail.com",
      password: "cream",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  /* 
  // Load hash from your password DB.
  bcrypt.compare("bacon", hash, function (err, res) {
    // res == true
  });
  bcrypt.compare("veggies", hash, function (err, res) {
    // res = false
  });
  */
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  /*
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  */
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((response) => {
      res.json(response);
    })
    .then((err) => res.status(400).json(err));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      console.log(user) 
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
