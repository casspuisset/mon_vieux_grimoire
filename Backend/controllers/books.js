const { title } = require("process");
const Book = require("../models/books");
const fs = require("fs");

//Créer un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: "2",
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    averageRating: 3, //note temporaire pour test
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré" }))
    .catch((error) => {
      console.log("l'erreur est là");
      res.status(400).json({ error });
    });
};

exports.createRating = (req, res, next) => {
  const userGrade = req.body.rating;
  let ratingObject;
  if (userGrade && 0 < userGrade <= 5) {
    ratingObject = { ...req.body, grade: userGrade };
  } else {
    ratingObject = { ...req.body, grade: 0 };
  }
  delete ratingObject._id;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const bookGrade = book.ratings;
      const currentUser = req.auth.userId;
      const ratingList = bookGrade.map((rating) => rating.userId);
      if (!ratingList[currentUser]) {
        bookGrade.push(ratingObject);
        Book.updateOne(
          { _id: req.params.id },
          {
            ratings: bookGrade,
            //faudra update la note moyenne en plus
            _id: req.params.id,
          }
        )
          .then(() => {
            res.status(201).json();
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
        res.status(200).json(book);
      } else {
        res.status(403).json({ message: "Note déjà enregistrée" });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

//Modifier un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Modification non-autorisée" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Suppression non-autorisée" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé" });
            })
            .catch((error) => {
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Récupérer un livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

//Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Récupérer les 3 livres avec la meilleure moyenne
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error }));
};
