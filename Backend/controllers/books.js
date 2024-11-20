const Book = require("../models/books");

//Créer un nouveau livre
exports.createBook = (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};

//Modifier un livre
exports.modifyBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

//Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then((book) => res.status(200).json({ message: "Livre supprimé" }))
    .catch((error) => res.status(400).json({ error }));
};

//Récupérer un livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: eq.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

//Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
