import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import HttpError from './models/Httperror.js'; 
import router from './routes/all_routs.js';


const port = 3000;
const app = express();

app.use(express.json());

app.use('/', router);
// console.log(router);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
});

mongoose.connect(
    'mongodb+srv://ahmedc137b:12345@theclustergems.sztl7.mongodb.net/'
)
    .then(() => {
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
            console.log('mongoDB connected');
        });
    })
    .catch(err => {
        console.log(err);
        console.log('mongoDB not connected');
    });
