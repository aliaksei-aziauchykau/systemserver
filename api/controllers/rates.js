const Survey = require('../models/survey');
const Rate = require('../models/rate');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.rate_add_rate = (req, res, next) => {
  const rate = new Rate({
    _id: new mongoose.Types.ObjectId(),
    question1: req.body.question1,
    question2: req.body.question2,
    question3: req.body.question3,
    question4: req.body.question4,
    question5: req.body.question5,
    description: req.body.description,
    rate: req.body.rate,
    expert: mongoose.Types.ObjectId(req.body.expert),
    survey: mongoose.Types.ObjectId(req.body.survey),
    draft: req.body.draft
  });
  rate
    .save()
    .then(result => {
      Survey.update({_id: result.survey}, {$push: {rates: result._id}})
        .exec()
        .then(result => {
          res.status(200).json({
            message: req.body.draft ? 'Rating saved as draft.' : 'Formularz oceniony!'
          });
        }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}
