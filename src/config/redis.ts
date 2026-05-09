import redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisclient = new redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
})
redisclient.on('connect',()=>{
    console.log('Connected to Redis');
})
redisclient.on('error',(err)=>{
    console.log('Redis error',err);
})
export default redisclient;