import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import postsRouter from "./src/routes.ts/posts.routes";
import {authroutes} from './src/routes.ts/auth.routes'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);
app.get('/',(req,res)=>{
    res.send('Hello World!');
});
app.use('/posts', postsRouter);
app.use('/auth', authroutes);

const  PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
