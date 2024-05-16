const pg = require("pg");

const options = {};

module.exports = new pg.Pool(options);
