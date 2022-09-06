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
  if (err.hasOwnProperty("status") && err.hasOwnProperty("msg"))
    res.status(err.status).send({ status: err.status, msg: err.msg });
});

module.exports = app;
