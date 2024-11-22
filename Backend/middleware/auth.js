const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ");
    const decodedToken = jwt.verify(token[1], "TOKEN_SECRET_DU_CHAUDRON");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
  } catch (error) {
    res.status(401).json({ error });
  }
};
