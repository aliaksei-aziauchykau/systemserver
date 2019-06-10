const Survey = require('../models/survey');
const Rate = require('../models/rate');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.survey_get_survey = (req, res, next) => {
	Survey.findOne({ _id: req.params.id})
	.populate('rates')
	.populate('expertOne', '_id name discipline')
	.populate('expertTwo', '_id name discipline')
	.exec()
	.then(survey => {
		res.status(200).json(survey);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.survey_get_surveys = (req, res, next) => {
	let status = req.params.status;
	let filledBy = req.params.id;
	let expert = req.params.expert;
	let query = {};
	let query2 = null;
	if (status && filledBy) {
		query = {filledBy: filledBy, status: status};
	}
	if (status && filledBy == 'undefined') {
		query = { status: status};
	}
	if (expert !== 'undefined') {
		query = { expertOne: mongoose.Types.ObjectId(expert), status: status };
		query2 = { expertTwo: mongoose.Types.ObjectId(expert), status: status }
	}
	Survey.find({ $or: [query, query2].filter(Boolean)})
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

exports.survey_add_survey = (req, res, next) => {
	const survey = new Survey({
		_id: new mongoose.Types.ObjectId(),
		discipline: req.body.discipline,
		title: req.body.title,
		summary: req.body.summary,
		contribution: req.body.contribution,
		proof1: req.body.proof1,
		proof2: req.body.proof2,
		proof3: req.body.proof3,
		proof4: req.body.proof4,
		proof5: req.body.proof5,
		description: req.body.description,
		proof: req.body.proof,
		status: 'NEW',
		filledBy: req.body.filledBy
	});
	survey
	.save()
	.then(async result => {
		console.log(result);
		await User.update({_id: req.userData.userId, numberOfForms: { $exists: true }}, {$inc: {numberOfForms: -1}}).exec();
		res.status(201).json({
			message: 'Formularz dodany pomyślnie!',
			postedSurvey: {
				discipline: result.discipline,
				title: result.title,
				summary: result.summary,
				contribution: result.contribution,
				proof1: result.proof1,
				proof2: result.proof2,
				proof3: result.proof3,
				proof4: result.proof4,
				proof5: result.proof5,
				description: result.description,
				proof: result.proof,
				_id: result._id
			}
		});
	})
	.catch(err => { 
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.survey_assign_experts = (req, res, next) => {
	let id = req.params.id;
	Survey.updateOne({ _id: id}, { $set: { discipline: req.body.discipline, expertOne: mongoose.Types.ObjectId(req.body.expertOne), expertTwo: mongoose.Types.ObjectId(req.body.expertTwo) }}) 
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Formularz przypisany'
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.survey_unassign_experts = (req, res, next) => {
	let id = req.params.id;
	Survey.updateOne({ _id: id}, { $unset: { expertOne: '', expertTwo: '' }})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Formularz przypisany'
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.survey_update_survey = (req, res, next) => {
	Survey.updateOne({ _id: req.body._id }, { $set: req.body })
	.exec()
	.then(result => {
		res.status(200).json({
			result: result,
			message: 'Formularz zaktualizowany'
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.survey_delete_survey = (req, res, next) => {
	Survey.remove({_id: req.params.id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Formularz usunięty'
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}
