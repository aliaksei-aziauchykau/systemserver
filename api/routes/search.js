const express = require('express');
const router = express.Router();

const SearchController = require('../controllers/search');
const checkAuth = require('../middleware/check-auth');

router.get('/rated-surveys', checkAuth, SearchController.get_rated_surveys);


module.exports = router;
