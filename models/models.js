const db = require("../../be-nc-games/db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then(result => {
    return result.rows;
  });
};

exports.selectReviews = review_id => {
  if (isNaN(review_id) === true) {
    return Promise.reject({ status: 400, msg: "invalid review ID" });
  } else {
    return db
      .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
      .then(result => {
        if (result.rows.length >= 1) {
          return result.rows[0];
        } else {
          return Promise.reject({
            status: 404,
            msg: "This review was not found",
          });
        }
      });
  }
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(result => {
    return result.rows;
  });
};
