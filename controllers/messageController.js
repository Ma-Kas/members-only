const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message');

// Handle GET form of new message
exports.create_message_get = async function (req, res, next) {
  try {
    res.render('message-form', {
      title: 'New Message',
    });
  } catch (err) {
    return next(err);
  }
};

// Handle POST form of new message
exports.create_message_post = [
  // Sanitize and Validate Form Data
  body('msg-title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A title must be provided.'),
  body('message')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A message must be provided.'),
  async function (req, res, next) {
    try {
      const errors = validationResult(req);

      const newMessage = new Message({
        title: req.body['msg-title'],
        message: req.body.message,
        author: req.body.author,
      });

      if (!errors.isEmpty) {
        res.render('message-form', {
          title: 'New Message',
          errors: errors.array(),
        });
      } else {
        await newMessage.save();
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  },
];
