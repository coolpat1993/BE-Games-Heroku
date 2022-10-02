const {
  selectCategories,
  selectReviews,
  selectUsers,
  updateReview,
  selectAllReviews,
  selectComments,
  insertComment,
  removeById,
  insertReview,
} = require("../models/models.js");

const api = require("../endpoints.json");

exports.getApi = (req, res) => {
  res.status(200).send(api);
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
  const objectValues = [];
  const sort_by = req.query.sort_by;
  const order_by = req.query.order_by;
  const objectKeys = Object.keys(req.query);
  const reqQuery = req.query;

  selectAllReviews(objectValues, sort_by, order_by, objectKeys, reqQuery)
    .then(reviews => {
      res.status(200).send({ reviews });
    })
    .catch(err => {
      next(err);
    });
};

exports.viewComments = (req, res, next) => {
  const { review_id } = req.params;
  selectComments(review_id)
    .then(comment_by_id => {
      res.status(200).send({ comments: comment_by_id });
    })
    .catch(err => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const review_id = req.params.review_id;
  const newComment = req.body;
  insertComment(newComment, review_id)
    .then(newComment => {
      res.status(201).send({ newComment });
    })
    .catch(err => {
      next(err);
    });
};

exports.postReview = (req, res, next) => {
  const newReview = req.body;
  insertReview(newReview)
    .then(newReview => {
      res.status(201).send({ newReview });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteCommentById = (req, res) => {
  const comment_id = req.params.comment_id;
  removeById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};
