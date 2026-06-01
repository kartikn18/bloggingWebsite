import redis from "ioredis";
import dotenv from "dotenv";
import { readdirSync } from "fs";

dotenv.config();

const redisclient = new redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
})
console.log('redis info',process.env.REDIS_HOST,process.env.REDIS_PORT);
redisclient.on('connect',()=>{
    console.log('Connected to Redis');
})
redisclient.on('error',(err)=>{
    console.log('Redis error',err);
})
export default redisclient;