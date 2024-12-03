import {addAlbum, deleteAlbum, getAlbumList} from '@/controller/albumController';
import express from 'express';

const albumRouter = express.Router();

albumRouter.get('/list', getAlbumList);
albumRouter.post('/add', addAlbum);
albumRouter.post('/delete', deleteAlbum);

export default albumRouter;
