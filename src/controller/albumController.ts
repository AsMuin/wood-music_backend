import apiResponse from '@/utils/response';
import {controllerAction} from '.';
import pageQuery from '@/utils/pageQuery';
import Album, {IAlbum} from '@/model/albumModel';
import CF_upload from '@/config/cloudFlare';

const getAlbumList: controllerAction = async (req, res) => {
    try {
        const {pageIndex = 0, pageSize = 20} = req.body;
        const getResponse = apiResponse(res);
        const albumQuery = pageQuery(Album)(pageIndex, pageSize);
        return getResponse(true, '专辑列表获取成功', {data: albumQuery});
    } catch (error: any) {
        apiResponse(res)(false, error.message);
    }
};

const addAlbum: controllerAction = async (req, res) => {
    try {
        const {name, bgColor, desc} = req.body;
        const getResponse = apiResponse(res);
        const image = req.file;
        if (!name || !bgColor || !desc || !image) {
            return getResponse(false, '缺少必要的信息');
        }
        const imageUrl = await CF_upload(image.buffer, image.originalname);
        if (!imageUrl) {
            return getResponse(false, '专辑图片上传失败');
        }
        const newAlbum: IAlbum = {name, bgColor, desc, image: imageUrl};
        await new Album(newAlbum).save();
        return getResponse(true, '专辑添加成功');
    } catch (error: any) {
        console.error(error);
        apiResponse(res)(false, error.message);
    }
};

const deleteAlbum: controllerAction = async (req, res) => {
    try {
        const {id} = req.body;
        const getResponse = apiResponse(res);
        const album = await Album.findById(id);
        if (!album) {
            return getResponse(false, '该专辑不存在');
        } else {
            await album.deleteOne();
            return getResponse(true, '删除成功');
        }
    } catch (error: any) {
        console.error(error);
        apiResponse(res)(false, error.message);
    }
};

export {getAlbumList, addAlbum, deleteAlbum};
