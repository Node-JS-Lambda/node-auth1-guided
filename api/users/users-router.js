const router = require("express").Router();
const bcrypt = require('bcryptjs');

const Users = require("./users-model.js");

router.get("/", (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 12);
    const user = { username, password: hash };
    await Users.add(user);
    res.status(201).json({ message: `You are now registered, ${username}` });
  } catch(err) {
    next(err);
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findBy({ username }).first();
    if(user == null) {
      res.status(401).json('invalid credentials');
      return;
    }

    const success = bcrypt.compareSync(password, user.password);
    if(!success) {
      res.status(401).json('invalid credentials');
      return;
    }

    req.session.user = user;
    res.status(200).json({ message: `You are now logged in, ${username}` });
  } catch(err) {
    next(err);
  }
});

router.get('/logout', (req, res, next) => {
  if(req.session.user) {
    req.session.destroy(err => {
      if(err != null) {
        next(err);
        return;
      }
      res.status(200).json({ message: `You are now logged out` });
    })
  } else {
    res.status(200).json({ message: `You were already logged out!` });
  }
})

router.get('/asdf', (req, res) => {
  res.json(req.session);
});

module.exports = router
