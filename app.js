const express = require("express");
const { testExample, viewCategories } = require("./controllers/controllers");

const app = express();

app.get("/api/", testExample);

app.get("/api/categories", viewCategories);

module.exports = app;
