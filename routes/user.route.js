const router = require("express").Router();
const signup = require("../controllers/user/signup");
const signin = require("../controllers/user/login");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/").get((_, res) => res.send("Hello World"));

module.exports = router;
