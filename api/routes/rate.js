const express = require('express');
const router = express.Router();

const RateController = require('../controllers/rates');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, RateController.rate_add_rate);


module.exports = router;