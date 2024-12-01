import express from 'express';
import 'dotenv/config';

//服务配置
const app = express();
const port = process.env.PORT || 3222;

// 中间件
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//路由

app.get('/test', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port} 🎉🎉🎉🎉`);
});
