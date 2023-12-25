const { body, validationResult } = require('express-validator');
const passport = require('passport');

// Handle GET form of user login
exports.login_get = async function (req, res, next) {
  try {
    res.render('login-form', {
      title: 'Log In',
      messages: req.session.messages,
    });
  } catch (err) {
    return next(err);
  }
};

// Handle POST form of user login
exports.login_post = [
  // Sanitize and validate form data
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please enter a username.'),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please enter a password.'),
  async function (req, res, next) {
    try {
      // Extract errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('login-form', {
          title: 'Log In',
          errors: errors.array(),
        });
        return;
      } else {
        passport.authenticate('local', {
          successRedirect: '/',
          failureRedirect: '/login',
          failureMessage: true,
        })(req, res);
      }
    } catch (err) {
      return next(err);
    }
  },
];
