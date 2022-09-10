const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then(result => {
    return result.rows;
  });
};

const reviewSansReviewBody = `reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes,`;

exports.selectReviews = review_id => {
  if (isNaN(review_id) === true) {
    return Promise.reject({ status: 400, msg: "invalid review ID" });
  } else {
    return db
      .query(
        `SELECT ${reviewSansReviewBody} COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
        [review_id]
      )
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

exports.updateReview = (review_id, updates) => {
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;",
      [updates, review_id]
    )
    .then(result => {
      if (result.rows.length >= 1) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 400,
          msg: "This data is unreachable at this time",
        });
      }
    });
};

exports.selectAllReviews = (
  objectValues,
  sort_by = "created_at",
  order_by = "DESC",
  objectKeys = ["category"],
  reqQuery
) => {
  for (const [key, value] of Object.entries(reqQuery)) {
    if (key !== "sort_by" && key !== "order_by") {
      objectValues.push(value);
    }
  }

  const validSortColumns = ["created_at", "review_id", "title"];
  const validOrder = ["ASC", "DESC"];
  const validKeys = [
    "sort_by",
    "order_by",
    "category",
    "votes",
    "owner",
    "title",
    "designer",
  ];
  let queryStr = `SELECT ${reviewSansReviewBody} COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id`;

  let columnName = objectKeys.filter(value => {
    return value !== "sort_by" && value !== "order_by";
  });

  queryValues = [];

  if (objectValues.length > 0) {
    queryStr += ` WHERE reviews.${columnName[0]} = $1`;
    queryValues.push(objectValues[0]);
    for (let i = 1; i < objectValues.length; i++) {
      queryStr += ` AND reviews.${columnName[i]} = $${i + 1}`;
      queryValues.push(objectValues[i]);
    }
  }

  queryStr += ` GROUP BY reviews.review_id`;
  if (
    !validSortColumns.includes(sort_by) ||
    !validOrder.includes(order_by) ||
    !objectKeys.every(currentValue => validKeys.includes(currentValue))
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  queryStr += ` ORDER BY ${sort_by} ${order_by};`;
  return db.query(queryStr, queryValues).then(result => {
    if (result.rows.length >= 1) {
      return result.rows;
    } else {
      return Promise.reject({
        status: 400,
        msg: "There were no reviews with those parameters",
      });
    }
  });
};

exports.selectComments = review_id => {
  return db
    .query(
      `SELECT ${reviewSansReviewBody} COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then(result => {
      if (result.rows.length > 0) {
        return db
          .query(
            `SELECT comments.* FROM comments LEFT JOIN reviews ON comments.review_id=reviews.review_id WHERE reviews.review_id = $1;`,
            [review_id]
          )
          .then(result => {
            if (result.rows.length > 0) {
              return result.rows;
            } else {
              return Promise.reject({
                status: 200,
                msg: "This comment was not found",
              });
            }
          });
      } else {
        return Promise.reject({
          status: 400,
          msg: "This review was not found",
        });
      }
    });
};
exports.insertComment = ({ body, author }, urlId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [urlId])
    .then(result => {
      if (
        (result.rows.length === 1 && urlId > 0) ||
        body === undefined ||
        author === undefined
      ) {
        return db
          .query(
            `INSERT INTO comments (body, review_id, author) 
  VALUES ($1, $2, $3) RETURNING *;`,
            [body, urlId, author]
          )
          .then(result => {
            return result.rows[0];
          });
      } else {
        return Promise.reject({
          status: 400,
          msg: "There was no review with this review_id",
        });
      }
    });
};

exports.removeById = comment_id => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(() => {});
};
