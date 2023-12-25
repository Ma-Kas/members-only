const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Controller Modules
const signup_controller = require('../controllers/signUpController');
const upgrade_controller = require('../controllers/upgradeController');
const login_controller = require('../controllers/logInController');
const message_controller = require('../controllers/messageController');

// GET Home
router.get('/', async function (req, res, next) {
  try {
    const allMessages = await Message.find({})
      .populate('author', 'username')
      .sort({ timestamp: 1 });
    res.render('index', { title: 'Members Only', messageList: allMessages });
  } catch (err) {
    return next(err);
  }
});

// Handle Admin Delete of message
router.post('/', async function (req, res, next) {
  try {
    await Message.findByIdAndDelete(req.body.messageId);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
});

// GET request for new signup
router.get('/sign-up', signup_controller.signup_get);

// POST request for new signup
router.post('/sign-up', signup_controller.signup_post);

// GET request for log in
router.get('/login', login_controller.login_get);

// POST request for log in
router.post('/login', login_controller.login_post);

// Handle GET Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// GET request for upgrading membership
router.get('/upgrade', upgrade_controller.upgrade_get);

// POST request for upgrading membership
router.post('/upgrade', upgrade_controller.upgrade_post);

// GET request for new message
router.get('/create', message_controller.create_message_get);

// POST request for new message
router.post('/create', message_controller.create_message_post);

module.exports = router;
