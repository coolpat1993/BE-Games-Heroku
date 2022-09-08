const {
  selectCategories,
  selectReviews,
  selectUsers,
  updateReview,
  selectAllReviews,
} = require("../models/models.js");

exports.testExample = (request, response) => {
  response.status(200).send({ msg: "this is a message" });
};

exports.viewCategories = (req, res) => {
  selectCategories().then(catas => {
    res.status(200).send({ categories: catas });
  });
};

exports.viewReviews = (req, res, next) => {
  const { review_id } = req.params;
  selectReviews(review_id)
    .then(review_by_id => {
      res.status(200).send({ review: review_by_id });
    })
    .catch(err => {
      next(err);
    });
};

exports.viewUsers = (req, res, next) => {
  selectUsers()
    .then(user => {
      res.status(200).send({ users: user });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const updates = req.body.inc_votes;
  updateReview(review_id, updates)
    .then(review => {
      res.status(201).send({ review });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order_by = req.query.order_by;
  // const category = req.query.category;
  let category;
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "sort_by" && key !== "order_by") {
      category = value;
    }
  }

  let objectKeys = [];

  if (Object.keys(req.query).length > 0) {
    objectKeys = Object.keys(req.query);
  } else {
    objectKeys = ["category"];
  }

  selectAllReviews(category, sort_by, order_by, objectKeys)
    .then(reviews => {
      res.status(200).send({ reviews });
    })
    .catch(err => {
      next(err);
    });
};
