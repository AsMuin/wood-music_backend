import {addAlbum, deleteAlbum, getAlbumList} from '@/controller/albumController';
import express from 'express';
import multer from '@/middleware/multer';
const albumRouter = express.Router();

albumRouter.get('/list', getAlbumList);
albumRouter.post('/add', multer.single('image'), addAlbum);
albumRouter.post('/delete', deleteAlbum);

export default albumRouter;
