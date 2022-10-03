const express = require("express");

const cors = require("cors");

const {
  viewCategories,
  viewReviews,
  viewUsers,
  patchReview,
  getAllReviews,
  viewComments,
  postComment,
  deleteCommentById,
  getApi,
  postReview,
  viewMisc,
} = require("./controllers/controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/", getApi);

app.get("/api/categories", viewCategories);

app.get("/api/reviews/:review_id", viewReviews);

app.get("/api/users", viewUsers);

app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id/comments", viewComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.post("/api/reviews", postReview);

app.get("/api/misc", viewMisc);

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
  if (err.code == "23502" || err.code == "23503") {
    res.status(400).send({
      status: 400,
      msg: "invalid/missing POST data",
    });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "caught an error");
});

module.exports = app;
