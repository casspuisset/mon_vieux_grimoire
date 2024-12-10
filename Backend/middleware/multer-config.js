const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.split(" ").join("_");
    callback(null, name + Date.now() + "." + extension);
  },
});

const uploadImage = multer({ storage }).single("image");

const sharpResize = async (req, res, next) => {
  if (req.file) {
    const filePath = req.file.path;

    sharp(filePath)
      .resize({ height: 260, width: 206, fit: "cover" })
      .webp({ quality: 85 })
      .toBuffer()
      .then((data) => {
        sharp(data)
          .toFile(filePath)
          .then(() => {
            next();
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return next();
  }
};

module.exports = {
  uploadImage,
  sharpResize,
};
