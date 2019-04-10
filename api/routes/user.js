const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.get('/', UserController.user_get_user);

router.get('/users', UserController.user_get_users);

router.get('/experts/:discipline', checkAuth, UserController.user_get_experts);

router.post('/', UserController.user_signup);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.post('/forgot', UserController.user_forgot);

router.post('/reset', UserController.user_reset);

router.patch('/update', checkAuth, UserController.user_update_user);

router.delete('/:userId', checkAuth, UserController.user_delete_user);

module.exports = router;