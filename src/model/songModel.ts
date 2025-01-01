import mongoose from 'mongoose';

export interface ISong {
    name: string;
    desc: string;
    album: string;
    image: string;
    file: string;
    duration: string;
}
const songSchema = new mongoose.Schema<ISong>({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

const Song = mongoose.models.Song || mongoose.model<ISong>('Song', songSchema);

export default Song;
