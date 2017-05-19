const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const itemController = require('./item/itemController.js');
const userController = require('./user/userController.js');
const cookieController = require('./session/cookieController.js');
const sessionController = require('./session/sessionController.js');

const app = express();
const mongoURI = 'mongodb://localhost/listtest';
const staticPath = express.static(path.join(__dirname, '/../client'));

mongoose.connect(mongoURI);

// global middleware
app.use(staticPath);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

// ROUTES

// GET
//PAGES
app.get('/', (req, res) => {
  res.type('text/html').status(200);
  res.sendFile(path.join(__dirname, '/../client/login.html'));
});

app.get('/login', (req, res)=>{
  res.status(304).redirect('/');
})

app.get('/signup', (req, res) => {
  res.type('text/html').status(200);
  res.sendFile(path.join(__dirname, '/../client/signup.html'));
});

app.get('/list', (req, res) => {
  res.type('text/html').status(200);
  res.sendFile(path.join(__dirname, '/../client/list.html'));
});

app.get('/users', (req, res) => {
  res.type('text/html').status(200);
  res.sendFile(path.join(__dirname, '/../client/users.html'));
});


//INFO
app.get('/items', itemController.getAllItems);
app.get('/allUsers',userController.getAllUsers);

app.get('/sessions', sessionController.getAllCookies);
app.get('/activeSession', sessionController.getLatest);

// POST
//add data
app.post('/items', itemController.addItem);

app.post('/signup', userController.createUser, cookieController.setSSIDCookie, sessionController.startSession, (req, res)=>{
  res.status(200).redirect('/list');
});

app.post('/login', userController.verifyUser, cookieController.setSSIDCookie,  sessionController.startSession, sessionController.updateSession, (req, res)=>{
  res.status(200).redirect('/list');
});


// PUT
app.put('/items', itemController.updateItem, (req, res)=>{
  res.status(200).send();
})



//DELETE
app.delete('/items', itemController.deleteItem, (req, res) =>{
  res.status(200).send();
})

app.listen(3000);

module.exports = app;