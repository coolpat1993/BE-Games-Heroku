const express = require("express");
const {
  testExample,
  viewCategories,
  viewReviews,
  viewUsers,
  patchReview,
  getAllReviews,
  viewComments,
  postComment,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/", testExample);

app.get("/api/categories", viewCategories);

app.get("/api/reviews/:review_id", viewReviews);

app.get("/api/users", viewUsers);

app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id/comments", viewComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.hasOwnProperty("status") && err.hasOwnProperty("msg")) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code == "22P02" || err.code == "42703") {
    res
      .status(400)
      .send({ status: 400, msg: "SQL ERROR invalid user data input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code == "23502") {
    res.status(400).send({
      status: 400,
      msg: "invalid vote data format, use '{inc_votes: Num}'",
    });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "caught an error");
});

module.exports = app;
