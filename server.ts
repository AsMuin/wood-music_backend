import express from 'express';
import 'dotenv/config';
import connectToMongoDB from './src/config/mongoDB';
import songRouter from './src/route/songRoute';
import userRouter from '@/route/userRoute';

//服务配置
const app = express();
const port = process.env.PORT || 3222;
connectToMongoDB();

// 中间件
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//路由
app.use('/api/song', songRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server running on  http://localhost:${port} 🎉🎉🎉🎉`);
});
