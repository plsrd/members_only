const mongoose = require('mongoose');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  created_at: { type: Date, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Message' },
});

MessageSchema.virtual('url').get(function () {
  return '/message/' + this._id;
});

MessageSchema.virtual('age').get(function () {
  return formatDistanceToNow(this.created_at, { addSuffix: true });
});

module.exports = mongoose.model('Message', MessageSchema);
