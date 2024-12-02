import {addSong, geiSongList} from '../controller/songController';
import express from 'express';
import upload from '../middleware/multer';

const songRouter = express.Router();

songRouter.post(
    '/add',
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
export default songRouter;
