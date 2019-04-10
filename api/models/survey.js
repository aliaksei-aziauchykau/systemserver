const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	discipline: String,
	title: String,
	summary: String,
	contribution: String,
	proof1: String,
	proof2: String,
	proof3: String,
	proof4: String,
	proof5: String,
	description: String,
	proof: String,
	status: String,
	rates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rate'}],
	filledBy: String,
	expertOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	expertTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Survey', surveySchema);