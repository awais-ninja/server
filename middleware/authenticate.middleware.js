const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(403).send("Invalid Session");
        }
        console.log(decodedToken);
        next();
      });
    }
    req.session.token = token;
  } catch (error) {
    if (error) {
      return res.status(403).send("Invalid Session");
    }
  }
};
