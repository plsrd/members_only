const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromptSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

module.exports = mongoose.model('Prompt', PromptSchema);
