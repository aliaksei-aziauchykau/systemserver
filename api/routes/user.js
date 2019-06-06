const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.get('/', UserController.user_get_user);

router.get('/search/users/:discipline', checkAuth, UserController.user_get_users_by_discipline);

router.get('/search/experts/:discipline', checkAuth, UserController.user_get_experts);

router.post('/', UserController.user_signup);

router.post('/', UserController.user_signup);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.post('/forgot', UserController.user_forgot);

router.post('/reset', UserController.user_reset);

router.patch('/update', checkAuth, UserController.user_update_user);

router.get('/numberOfAssignedForms', checkAuth, UserController.user_number_of_assigned_forms);


router.get('/users', UserController.user_get_users);

router.get('/users/:userId', UserController.user_get_user_by_id);

router.post('/users', UserController.user_post_create_user)

router.put('/users/:userId', UserController.user_put_update_user)

router.delete('/users/:userId', checkAuth, UserController.user_delete_user);

module.exports = router;
