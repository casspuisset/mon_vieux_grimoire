const multer = require("multer");
const sharp = require("sharp");
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

const resize = sharp().resize({
  width: 206,
  height: 260,
});
//à tester quand le problème de post sera réglé

module.exports = multer({ storage }).single("image").resize;