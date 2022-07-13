const mongoose = require('mongoose');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, minLength: 1, maxLength: 25 },
  lastname: { type: String, required: true, minLength: 1, maxLength: 25 },
  email: { type: String, required: true, minLength: 1, lowercase: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ['user', 'member', 'admin'],
    default: 'user',
  },
  created_at: { type: Date, required: true },
  logins: [Date],
});

UserSchema.virtual('fullname').get(function () {
  return this.firstname + ' ' + this.lastname;
});

UserSchema.virtual('url').get(function () {
  return '/users/' + this._id;
});

UserSchema.virtual('age').get(function () {
  return formatDistanceToNow(this.created_at, { addSuffix: true });
});

module.exports = mongoose.model('User', UserSchema);
