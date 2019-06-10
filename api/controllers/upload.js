const UploadHandler = require('../handlers/upload');
const mongoose = require('mongoose');

const addUploadItem = (req, res) => {
    const {
        id,
        surveyId,
    } = req.params;

    const {
        description,
    } = req.body;

    Promise.all(req.files.map(fileItem => {
        const uploadItem = {
            owner: mongoose.Types.ObjectId(id),
            surveyId: mongoose.Types.ObjectId(surveyId),
            name: fileItem.originalname,
            description,
            path: fileItem.path,
            exactPath: fileItem.path
                .replace('public/', '')
                .replace('public\\', '')
                .replace(/\\/g, '/')
        };

        return UploadHandler.addUploadItem(uploadItem);
        
    }))
    .then(() => {
        res.status(200).json({message: "File is uploaded"});
    })
    .catch(err => {
        res.status(500).json({message: "Error uploading file." + err})
    })
}

const getUploadItems = (req, res) => {
    const {
        id,
        surveyId,
    } = req.params;
    
    UploadHandler.getUploadItems({id, surveyId})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(404).json({message:  err})
        })
}

module.exports = {
    addUploadItem,
    getUploadItems
} 
