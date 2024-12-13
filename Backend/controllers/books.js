const Book = require("../models/books");
const fs = require("fs");

//Créer un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré" }))
    .catch((error) => {
      fs.unlinkSync(req.file.path);
      res.status(400).json({ error });
    });
};

//Poster une note
exports.createRating = async (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.body.userId;
  const rating = req.body.rating;

  Book.findById(bookId)
    .then((book) => {
      return Book.findOne({ _id: bookId, "ratings.userId": userId }).then(
        (alreadyRated) => {
          if (alreadyRated) {
            return res.status(403).json({
              message: "Vous avez déjà noté ce livre.",
            });
          } else {
            const gradesArray = book.ratings.map((rating) => rating.grade);
            const averageRating = newAverageRating(gradesArray, rating);

            book.ratings.push({ userId, grade: rating });
            book.averageRating = averageRating;

            return book
              .save()
              .then((bookWithNewRating) => {
                res.status(201).json({
                  ...bookWithNewRating._doc,
                  id: bookWithNewRating._doc._id,
                });
              })
              .catch((error) => {
                res.status(500).json({ error });
              });
          }
        }
      );
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

//fonction de calcul de la nouvelle moyenne
function newAverageRating(gradesArray, rating) {
  const sumGrades = gradesArray.reduce((sum, grade) => sum + grade, 0);

  const newSumGrades = sumGrades + rating;
  const newAverageRating = (newSumGrades / (gradesArray.length + 1)).toFixed(1);
  return newAverageRating;
}

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
  const bookId = req.params.id;
  Book.findById(bookId)
    .then((book) => {
      if (book === null) {
        return res.status(404).json({
          message: "Livre non trouvé.",
          error: error,
        });
      }
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Une erreur est survenue lors de la récupération du livre.",
        error: error,
      });
    });
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
