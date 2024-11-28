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
});
const image = multer({ storage }).single("image");

const sharp = (req, res, next) => {
  const filepath = req.file.path;
  sharp(filepath)
    .resize({ width: 206, height: 260 })
    .webp({ quality: 85 })
    .toFile(filepath)
    .then(() => {
      fs.unlink(filePath, () => {
        req.file.path = outputFilePath;
        next();
      });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  image,
  sharp,
};
