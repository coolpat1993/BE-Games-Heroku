const { totalCount } = require("../../be-nc-games/db/connection.js");
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
      .query("SELECT * FROM reviews")
      .then(totalReviews => {
        return totalReviews.rows.length;
      })
      .then(reviewLength => {
        if (review_id > 0 && review_id <= reviewLength) {
          return db
            .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
            .then(result => {
              return result.rows[0];
            });
        } else {
          return Promise.reject({
            status: 200,
            msg: "This review does not yet exist",
          });
        }
      });
  }
};
