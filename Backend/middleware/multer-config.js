const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
  SharpMulter: {
    destination: (req, file, callback) => callback(null, "images"),
    imageOptions: {
      fileFormat: "jpg",
      quality: 80,
      resize: { width: 500, height: 500 },
    },
  },
});
const image = multer({ storage }).single("image");

const upload = multer({ storage });

const sharpResize = (req, res, next) => {
  console.log(req.file);
  const filepath = req.file.buffer;
  sharp(filepath)
    .resize({ width: 206, height: 260 })
    .webp({ quality: 85 })
    .toBuffer()
    .then(() => (req.file.path = filepath))
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  image,
  sharpResize,
};
