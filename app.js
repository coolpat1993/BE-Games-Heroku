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

module.exports = app;
