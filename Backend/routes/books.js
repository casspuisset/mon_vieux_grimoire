const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/books");
const auth = require("auth");
const multer = require("../middleware/multer-config");

//Créer un nouveau livre
router.post("/", auth, multer, bookCtrl.createBook);

//Modifier un livre
router.put("/:id", auth, multer, bookCtrl.modifyBook);

//Supprimer un livre
router.delete("/:id", auth, bookCtrl.deleteBook);

//Obtenir un livre particulier à partir de son id
router.get("/:id", auth, bookCtrl.getOneBook);

//Obtenir tous les livres
router.get("/", auth, bookCtrl.getAllBooks);

module.exports = router;
