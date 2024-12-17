import {addSong, deleteSong, geiSongList} from '../controller/songController';
import express from 'express';
import upload from '../middleware/multer';
import userAuth from '@/middleware/userAuth';

const songRouter = express.Router();

songRouter.post(
    '/add',
    userAuth,
    upload.fields([
        {
            name: 'image',
            maxCount: 1
        },
        {name: 'audio', maxCount: 1}
    ]),
    addSong
);
songRouter.get('/list', geiSongList);

songRouter.post('/delete', userAuth, deleteSong);

export default songRouter;
