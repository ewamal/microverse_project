const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: {type: String},
  password: {type: String},
  email: {type: String},
  fullName: {type: String}
});

module.exports = mongoose.model('User', userSchema);
