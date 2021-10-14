const cookieParser = require('cookie-parser');

const express = require('express');
const io = require('socket.io')();
const indexRouter = require('./routes/index');
const logger = require('morgan');

const path = require('path');

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = { app, io };
