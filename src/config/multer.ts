import multer from 'multer';
import os from 'os';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const uploadDir = path.join(os.tmpdir(), 'blog-uploads');

export const multerConfig = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadDir),
        filename: (_req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${unique}-${file.originalname}`);
        },
    }),

    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith('image/')) {

            cb(null, true);

        } else {

            cb(
                new Error('Only image files are allowed')
            );

        }
    }

});