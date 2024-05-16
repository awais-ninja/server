require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// app.use(require("./middleware/authenticate.middleware"));

app.use("/api/v1/", require("./routes/user.route"));

app.listen(8080, (err) => {
  if (err) console.log(err);
  console.log(`Listening on 8080`);
});
