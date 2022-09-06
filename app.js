const express = require("express");
const {
  testExample,
  viewCategories,
  viewReviews,
  viewUsers,
  patchReview,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/", testExample);

app.get("/api/categories", viewCategories);

app.get("/api/reviews/:review_id", viewReviews);

app.get("/api/users", viewUsers);

app.patch("/api/reviews/:review_id", patchReview);

app.use((err, req, res, next) => {
  if (err.hasOwnProperty("status") && err.hasOwnProperty("msg")) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else {
    if (err.code == "22P02") {
      res.status(400).send({ status: 400, msg: "invalid vote data" });
    }
  }
});

module.exports = app;

// if (err.code === "22P02") console.log("this here");
// res.status(400).send({ msg: "this is an error" });
