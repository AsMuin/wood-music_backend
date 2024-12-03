import mongoose from 'mongoose';

interface IUser {
    name: string;
    email: string;
    password: string;
    avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
