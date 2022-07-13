const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const async = require('async');

const Message = require('../models/message');

exports.message_create_get = (req, res, next) => {
  if (!req.user) res.redirect('/');
  res.render('message-form');
};

exports.message_create_post = [
  body('title', 'Title is required.').escape().trim().isLength(1),
  body('content').isLength(1),
  (req, res, next) => {
    const { title, content } = req.body;
    const sanitizedContent = sanitizeHtml(content);

    const errors = validationResult(req);

    let message = new Message({
      title,
      content: sanitizedContent,
    });

    if (!errors.isEmpty()) {
      res.render('message-form', { message, errors: errors.array() });
    } else {
      Object.assign(message, {
        created_at: new Date(),
        user: req.user._id,
      });

      message.save(err => {
        if (err) return next(err);
        res.redirect('/');
      });
    }
  },
];

exports.message_delete_post = (req, res, next) => {
  async.series(
    {
      deleteMessage: cb => Message.findByIdAndDelete(req.params.id).exec(cb),
      messages: cb => Message.find().populate('user').exec(cb),
    },
    (err, { messages }) => {
      if (err) next(err);
      res.render('index', {
        messages,
        alert: `Message ${req.params.id} deleted!`,
      });
    }
  );
};
