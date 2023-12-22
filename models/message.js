const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  message: { type: String, required: true, minLength: 1 },
  timestamp: { type: Date, required: true, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('url').get(function () {
  // Can't use arrow function as need to use 'this'
  return `/message/${this._id}`;
});

MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

MessageSchema.virtual('timestamp_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model('Message', MessageSchema);
