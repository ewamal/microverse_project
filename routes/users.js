const express = require('express');
const router = express.Router();
const server = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user');

//--authentication--
const bcrypt = require('bcrypt');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

router.post('/', (req,res) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }
  })

  User.find({userName: req.body.userName})
  .exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "User with this user name already exists"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err,hash) => {
        if(err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User ({
            userName: req.body.userName,
            email: req.body.email,
            password: hash,
            fullName: req.body.fullName
          });
          user
          .save()
          .then(result => {
            res.status(201).json({
              message: 'user created',
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
        }
      })
    }
  })
});

router.get('/', (req,res) => {
  User.find()
  .exec()
  .then(docs => {
    if(docs.length >= 0){
      res.status(200).json(docs);
    } else {
      res.json({
        message: 'No users found'
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});


module.exports = router;
