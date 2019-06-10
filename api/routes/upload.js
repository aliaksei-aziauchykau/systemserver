const express = require('express');
const router = express.Router();

const UploadController = require('../controllers/upload');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const {
            id,
            surveyId
        } = req.params;
        
        const path = `./public/uploads/${id}/${surveyId}`;
        pathCreate(path);
        callback(null, path);
    },
    filename: (req, file, callback) => {

        const fileName = Date.now() + '-'+ file.originalname;
        callback(null, fileName);
    }
});
const upload = multer({ storage }).array('userPdf', 10);

const pathCreate = (path) => {
    const pathArray = path.split("/");
    let curruntPath = pathArray[0];
    for(let i=1; i < pathArray.length; i++) {
        curruntPath = curruntPath + "/" + pathArray[i];
        if (!fs.existsSync(curruntPath)) {
            fs.mkdirSync(curruntPath);
        }
    }
}

const uploadMiddleware = (req, res, next) => {
    upload(req, res, err => {
        if(err) {
            res.status(500).json({message: "Error uploading file." + err})
        }
        next();
    })
}

router.post('/:id/survey/:surveyId', checkAuth, uploadMiddleware, UploadController.addUploadItem);
router.get('/:id/survey/:surveyId', checkAuth, UploadController.getUploadItems);


module.exports = router;