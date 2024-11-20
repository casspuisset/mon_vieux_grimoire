const express = require("express");
const auth = require("auth");
const bookCtrl = require("../controllers/books");
const router = express.Router();

//Créer un nouveau livre
router.post("/", auth, bookCtrl.createBook);

//Modifier un livre
router.put("/:id", auth, bookCtrl.modifyBook);

//Supprimer un livre
router.delete("/:id", auth, bookCtrl.deleteBook);

//Obtenir un livre particulier à partir de son id
router.get("/:id", auth, bookCtrl.getOneBook);

//Obtenir tous les livres
router.get("/", auth, bookCtrl.getAllBooks);

module.exports = router;
