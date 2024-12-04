import mongoose from 'mongoose';
export interface IAlbum {
    name: string;
    desc: string;
    bgColor: string;
    image: string;
}
const albumSchema = new mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    bgColor: {type: String, required: true},
    image: {type: String, required: true}
});

const Album = mongoose.model<IAlbum>('Album', albumSchema);

export default Album;
