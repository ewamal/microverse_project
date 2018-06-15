const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  date: Date
  //TO DO: date is saved in different timezone
});

module.exports = mongoose.model('Event', eventSchema);
