import multer from 'multer';

const upload = multer();

export const multerMiddleware = upload.single('image');
