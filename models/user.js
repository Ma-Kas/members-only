const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 1 },
  last_name: { type: String, required: true, minLength: 1 },
  username: { type: String, required: true, minLength: 1 },
  password: { type: String, required: true, minLength: 1 },
  membership: {
    type: String,
    required: true,
    enum: ['Guest', 'Member', 'Admin'],
    default: 'Guest',
  },
});

UserSchema.virtual('fullname').get(function () {
  // Can't use arrow function as need to use 'this'
  // Handle case of user not having either a first or last name
  // by returning an empty string
  let fullname = '';
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for user URL
UserSchema.virtual('url').get(function () {
  // Can't use arrow function as need to use 'this'
  return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
