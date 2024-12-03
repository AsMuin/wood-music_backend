import {controllerAction} from '.';
import apiResponse from '../utils/response';
import CF_upload from '../config/cloudFlare';
import getAudioDuration from '../utils/audioDuration';
import Song, {ISong} from '../model/songModel';

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
        return apiResponse(res)(false, err.message);
    }
};

const geiSongList: controllerAction = async (req, res) => {
    try{
        const songList = await Song.find();
        return apiResponse(res)(true,'获取音乐列表成功',{data:songList})
    }catch(err:any){
        console.error(err)
        return apiResponse(res)(false, err.message)
    }
};

export {addSong, geiSongList};
