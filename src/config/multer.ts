import multer from 'multer';
import os from 'os';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const uploadDir = path.join(os.tmpdir(), 'blog-uploads');

export const multerConfig = multer({
    storage:multer.memoryStorage(),
    limits:{fileSize: 5 * 1024 * 1024}, // 5MB
    fileFilter:(req,file,cb)=>{
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error('Only JPEG, PNG, and GIF files are allowed'));
        }
    }
})