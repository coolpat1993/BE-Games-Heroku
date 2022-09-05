const { selectCategories, selectReviews } = require("../models/models.js");

exports.testExample = (request, response) => {
  response.status(200).send({ msg: "this is a message" });
};

exports.viewCategories = (req, res) => {
  selectCategories().then(catas => {
    res.status(200).send({ categories: catas });
  });
};

exports.viewReviews = (req, res) => {
  const { review_id } = req.params;
  selectReviews(review_id).then(review_by_id => {
    res.status(200).send({ review: review_by_id });
  });
};
