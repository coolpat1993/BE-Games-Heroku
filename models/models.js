const db = require("../../be-nc-games/db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then(result => {
    return result.rows;
  });
};
