const db = require("../../be-nc-games/db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then(result => {
    return result.rows;
  });
};

exports.selectReviews = review_id => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then(result => {
      return result.rows[0];
    });
};
