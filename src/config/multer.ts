import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

export const multerConfig = multer({

    storage: multer.diskStorage({}),

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