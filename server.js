const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
let port = process.env.PORT || 3002;

//mongoose
let mongoose = require('mongoose');
if(process.env.MONGODB_URI) {
 mongoose.connect(process.env.MONGODB_URI);
}else {
 mongoose.connect('mongodb://localhost:27017/microverseproject', function(err){ //db = 'mongodb://localhost/yourdb'
  if(err){
   console.log(err);
  }else {
   console.log('mongoose connection is successful on: ' + 'mongodb://localhost:27017/microverseproject');
  }
 });
}
let db = mongoose.connection;

app.use(morgan('dev'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

if(!module.parent) {

   app.listen(port, () => console.log('Example app listening on port ' + port));
}

passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ userName: username }, function (err, user) {
      console.log(user);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result){
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  }
));

//-----------------------------monogdb----
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(err, client) {
  app.use('/events', passport.authenticate('basic', { session: false }),
 eventRoutes);
  app.use('/users', userRoutes);
  console.log("Connected successfully to server");
  app.emit('StartedMongodb');
});

module.exports = {app, db};
