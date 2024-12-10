const { title } = require("process");
const Book = require("../models/books");
const fs = require("fs");
const { get } = require("http");

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
    ratings: [
      {
        userId: req.auth.userId,
        grade: 3,
      },
    ],
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré" }))
    .catch((error) => {
      fs;
      res.status(400).json({ error });
    });
};

exports.createRating = async (req, res, next) => {
  console.log("la fonction create ratings");
  // const userGrade = req.body.rating;
  // if (0 < userGrade <= 5) {
  //   ratingObject = { ...req.body, grade: userGrade };
  // } else {
  //   ratingObject = { ...req.body, grade: 0 };
  // }
  // delete ratingObject._id;

  // Book.findOne({ _id: req.params.id })
  //   .then((book) => {
  //     const bookGrade = book.ratings;
  //     const currentUser = req.auth.userId;
  //     const ratingList = bookGrade.map((rating) => rating.userId);
  //     console.log(ratingList);
  //     if (!ratingList[currentUser]) {
  //       bookGrade.push(ratingObject);
  //       Book.updateOne(
  //         { _id: req.params.id },
  //         {
  //           ratings: bookGrade,
  //           //faudra update la note moyenne en plus
  //           _id: req.params.id,
  //         }
  //       )
  //         .then(() => {
  //           res.status(201).json();
  //         })
  //         .catch((error) => {
  //           res.status(400).json({ error });
  //         });
  //       res.status(200).json(book);
  //     } else {
  //       res.status(403).json({ message: "Note déjà enregistrée" });
  //     }
  //   })
  //   .catch((error) => res.status(400).json({ error }));
};

//Modifier un livre
exports.modifyBook = (req, res, next) => {
  console.log("la fonction modifier");
  // const bookObject = req.file
  //   ? {
  //       ...JSON.parse(req.body.book),
  //       imageUrl: `${req.protocol}://${req.get("host")}/images/${
  //         req.file.filename
  //       }`,
  //     }
  //   : { ...req.body };
  // delete bookObject._userId;
  // Book.findOne({ _id: req.params.id })
  //   .then((book) => {
  //     if (book.userId != req.auth.userId) {
  //       res.status(401).json({ message: "Modification non-autorisée" });
  //     } else {
  //       Book.updateOne(
  //         { _id: req.params.id },
  //         { ...bookObject, _id: req.params.id }
  //       )
  //         .then(() => res.status(200).json({ message: "Livre modifié" }))
  //         .catch((error) => res.status(400).json({ error }));
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(400).json({ error });
  //   });
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
  // Logique pour obtenir les détails du livre depuis la base de données
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
