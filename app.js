const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./api/routes/user');
const surveyRoutes = require('./api/routes/survey');
const rateRoutes = require('./api/routes/rate');
const uploadRoutes = require('./api/routes/upload');
const searchRoutes = require('./api/routes/search');

mongoose.connect(
    "mongodb+srv://dbUser:" + process.env.SurveyDBPass.trim() + "@cluster0-6fxvn.gcp.mongodb.net/test?retryWrites=true",
    //"mongodb://localhost:27017/survey",
    { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('connected to mongo database');
});

mongoose.connection.on('error', err => {
    console.log('pass', process.env.SurveyDBPass);
    console.log('Error at mongoDB: ' + err);
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/api/user', userRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/rate', rateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

app.get("*", (request, response) => 
    response.sendFile(path.join(__dirname, "public", "index.html"))
);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
