const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    name: String,
    path: String,
    exactPath: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
});

module.exports = mongoose.model('Upload', uploadSchema);