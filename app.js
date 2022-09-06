const express = require("express");
const {
  testExample,
  viewCategories,
  viewReviews,
} = require("./controllers/controllers");

const app = express();

app.get("/api/", testExample);

app.get("/api/categories", viewCategories);

app.get("/api/reviews/:review_id", viewReviews);

app.use((err, req, res, next) => {
  if (err.hasOwnProperty("status") && err.hasOwnProperty("msg"))
    res.status(err.status).send({ status: err.status, msg: err.msg });
});

module.exports = app;
