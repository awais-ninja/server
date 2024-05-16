const bcrypt = require("bcrypt");
const pool = require("../../utils/db");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  console.log(`reception`, email, password);
  if (!email || !password) {
    return res
      .status(403)
      .send({ message: "Provide email and password correctly" });
  }

  const emailExists = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  console.log(emailExists.rows[0]);

  if (emailExists.rowCount < 1) {
    return res.status(403).send({
      message: `${email} isn't registered. Maybe you forgot to register?`,
    });
  }

  const isPasswordSame = await bcrypt.compare(
    password,
    emailExists.rows[0].password
  );
  if (!isPasswordSame) {
    res.status(403).send({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: emailExists.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: 3 * 24 * 60 * 60 }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).send("signed in");
};
