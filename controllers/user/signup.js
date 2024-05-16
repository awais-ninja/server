const pool = require("../../utils/db");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    // check if email and password are provided in the body
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(403)
        .send({ message: "Provide email and password correctly" });
    }
    // check if the provided email already exists in the database
    const emailExists = await pool.query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    );

    // if exists throw error
    if (emailExists.rowCount > 0) {
      return res
        .status(403)
        .send({ message: "Email already registered. Forgotten Password?" });
    }

    // Encrypt the password via bcrypt and use that encrypted password to be stored in place of plain password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // otherwise add the user in database
    const addUser = await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
      [email, hashedPassword]
    );
    if (addUser.rowCount === 0) {
      return res.status(400).send({
        message: "Something went wrong while inserting user in database.",
      });
    }

    return res.send({
      message: `${addUser.rows[0].email} has been registered`,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      return res.status(400).send("Something went wrong on the server");
    }
  }
};
