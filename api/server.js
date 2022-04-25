const path = require('path')
const express = require('express')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex');

const usersRouter = require('./users/users-router.js')

const server = express()

const sessionConfig = {
  secret: 'ILAEFBiulWAFYVIsvyeif',
  cookie: {
    maxAge: 1000 * 60 * 2,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: KnexSessionStore({
    knex: require('../database/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
};

server.use(session(sessionConfig));

server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())

server.use('/api/users', usersRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
