import {controllerAction} from '.';
import apiResponse from '../utils/response';
import CF_upload from '../config/cloudFlare';
import getAudioDuration from '../utils/audioDuration';
import Song, {ISong} from '../model/songModel';
import pageQuery from '../utils/pageQuery';

const addSong: controllerAction = async (req, res) => {
    try {
        const {name, desc, album} = req.body;
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};
        const audioFile = files?.audio[0];
        const imageFile = files?.image[0];
        if (!name || !desc || !album || !audioFile || !imageFile) {
            return apiResponse(res)(false, '缺少必要参数');
        } else {
            const [audioUrl, imageUrl] = await Promise.all([
                CF_upload(audioFile.buffer, audioFile.originalname),
                CF_upload(imageFile.buffer, imageFile.originalname)
            ]);
            if (!audioUrl || !imageUrl) {
                return apiResponse(res)(false, '上传文件失败');
            }
            const duration = await getAudioDuration(audioFile.buffer);
            console.log({name, desc, album, audioUrl, imageUrl, duration});
            const song: ISong = {name, desc, album, file: audioUrl, image: imageUrl, duration};
            await new Song(song).save();
            return apiResponse(res)(true, '上传成功');
        }
    } catch (err: any) {
        console.error(err);
        apiResponse(res)(false, err.message);
    }
};

const geiSongList: controllerAction = async (req, res) => {
    try {
        const {pageIndex = 0, pageSize = 20} = req.query;
        const songPageQuery = await pageQuery(Song)(pageIndex as string | number, pageSize as string | number);
        return apiResponse(res)(true, '获取音乐列表成功', {data: songPageQuery});
    } catch (err: any) {
        console.error(err);
        apiResponse(res)(false, err.message);
    }
};

const deleteSong: controllerAction = async (req, res) => {
    try {
        const {id} = req.body;
        const getResponse = apiResponse(res);
        const song = await Song.findById(id);
        if (!song) {
            return getResponse(false, '音乐不存在');
        } else {
            await song.deleteOne();
            return getResponse(true, '删除成功');
        }
    } catch (error: any) {
        console.error(error);
        apiResponse(res)(false, error.message);
    }
};

export {addSong, geiSongList, deleteSong};
