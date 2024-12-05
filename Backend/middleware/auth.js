const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.headers);

  try {
    const token = req.headers.authorization.split(" ");
    const decodedToken = jwt.verify(token[1], "TOKEN_SECRET_DU_CHAUDRON");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    console.log("yup");
    res.status(401).json({ error });
  }
};
