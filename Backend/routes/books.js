const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const { uploadImage, sharpResize } = require("../middleware/multer-config");

//Créer un nouveau livre
router.post("/", auth, uploadImage, sharpResize, bookCtrl.createBook);

//Ajouter une notation
router.post("/:id/rating", auth, bookCtrl.createRating);

//Obtenir tous les livres
router.get("/", bookCtrl.getAllBooks);

//Obtenir les meilleures notations
router.get("/bestrating", bookCtrl.getBestRating);

//Obtenir un livre particulier à partir de son id
router.get("/:id", bookCtrl.getOneBook);

//Modifier un livre
router.put("/:id", auth, uploadImage, sharpResize, bookCtrl.modifyBook);

//Supprimer un livre
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
