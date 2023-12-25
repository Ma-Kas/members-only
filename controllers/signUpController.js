const { body, validationResult } = require('express-validator');
const User = require('../models/user');

// Handle GET form of new user signup
exports.signup_get = async function (req, res, next) {
  try {
    res.render('sign-up-form', { title: 'Sign-Up' });
  } catch (err) {
    return next(err);
  }
};

// Handle POST form of new user signup
exports.signup_post = [
  // Validate and Sanitize Data
  body('first-name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A first name is required.'),
  body('last-name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A last name is required.'),
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A username is required.')
    .custom(async (value) => {
      const user = await User.find({ username: value });
      if (user) {
        throw new Error('Username already in use.');
      }
    }),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A password is required.')
    .isLength({ min: 6 })
    .withMessage('Minimum password length: 6 characters.'),
  body('password-confirm')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match.'),

  async function (req, res, next) {
    try {
      // Extract errors from validation results
      const errors = validationResult(req);

      const newUser = new User({
        first_name: req.body['first-name'],
        last_name: req.body['last-name'],
        username: req.body.username,
        password: req.body.password,
      });

      if (!errors.isEmpty()) {
        // There are errors. Render form again
        res.render('sign-up-form', {
          title: 'Sign-Up',
          user: newUser,
          errors: errors.array(),
        });
        return;
      } else {
        // Form data is valid, save new user to database
        await newUser.save();
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  },
];
