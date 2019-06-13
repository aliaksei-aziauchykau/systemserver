const Survey = require('../models/survey');

exports.get_rated_surveys = (req, res, next) => {
    Survey.find({ rates: { $size: 2 } })
        .populate('rates')
        .populate('expertOne', '_id name discipline')
        .populate('expertTwo', '_id name discipline')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                surveys: docs.map(doc => {

                    return {
                        discipline: doc.discipline,
                        title: doc.title,
                        summary: doc.summary,
                        contribution: doc.contribution,
                        proof1: doc.proof1,
                        proof2: doc.proof2,
                        proof3: doc.proof3,
                        proof4: doc.proof4,
                        proof5: doc.proof5,
                        description: doc.description,
                        proof: doc.proof,
                        rates: doc.rates,
                        filledBy: doc.filledBy,
                        expertOne: doc.expertOne,
                        expertTwo: doc.expertTwo,
                        _id: doc._id
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
