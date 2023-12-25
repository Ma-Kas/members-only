const { body, validationResult } = require('express-validator');
const User = require('../models/user');

// GET request for upgrading membership
exports.upgrade_get = async function (req, res, next) {
  try {
    res.render('upgrade-form', { title: 'Upgrade Membership' });
  } catch (err) {
    return next(err);
  }
};

// Handle POST for upgrading membership
exports.upgrade_post = [
  body('secret-answer')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('An answer must be provided.')
    .toUpperCase()
    .equals('TANK')
    .withMessage('Incorrect Answer'),

  async function (req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        res.render('upgrade-form', {
          title: 'Upgrade Membership',
          errors: errors.array(),
        });
        return;
      } else {
        await User.findByIdAndUpdate(
          req.body.userId,
          { membership: 'Member' },
          {}
        );
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  },
];
