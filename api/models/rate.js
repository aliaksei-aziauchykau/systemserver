const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question1: String,
    question2: String,
    question3: String,
    question4: String,
    question5: String,
    description: String,
    rate: Number,
    survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    draft: Boolean
});

module.exports = mongoose.model('Rate', rateSchema);
