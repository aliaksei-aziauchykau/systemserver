const Upload = require('../models/upload');
const mongoose = require('mongoose');

const addUploadItem = async (data) => {
    const result = await new Upload(data).save();
    return result;
}

const getUploadItems = async (params) => {
    const result = await Upload.find({
        owner: mongoose.Types.ObjectId(params.id),
        surveyId: mongoose.Types.ObjectId(params.surveyId)
    }).exec();
    return result;
}

module.exports = {
    addUploadItem,
    getUploadItems
} 
