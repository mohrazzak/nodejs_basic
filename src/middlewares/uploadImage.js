const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { ApiError } = require('../utils/errors');

module.exports = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/${folderName}/`);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename = `${uuidv4()}${fileExt}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(new ApiError('Only images of type jpeg, png or gif are allowed'));
    }
  };

  const upload = multer({ storage, fileFilter });

  return function uploadImage(req, res, next) {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return next(err);
      }
      // Image upload is a must
      // if (!req.file) {
      //   return next(new ApiError('No file uploaded'));
      // }
      return next();
    });
  };
};
