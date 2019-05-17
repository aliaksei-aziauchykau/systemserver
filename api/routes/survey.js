const express = require('express');
const router = express.Router();

const SurveyController = require('../controllers/surveys');
const checkAuth = require('../middleware/check-auth');

router.get('/:id', checkAuth, SurveyController.survey_get_survey);

router.get('/:status/:id/:expert', checkAuth, SurveyController.survey_get_surveys);

router.post('/', checkAuth, SurveyController.survey_add_survey);

router.patch('/', checkAuth, SurveyController.survey_update_survey);

router.patch('/:id', checkAuth, SurveyController.survey_assign_experts);

router.delete('/:id', checkAuth, SurveyController.survey_delete_survey);

router.delete('/assign/:id', checkAuth, SurveyController.survey_unassign_experts);

module.exports = router;
