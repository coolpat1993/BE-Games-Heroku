const express = require("express");
const { testExample } = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/", testExample);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.hasOwnProperty("status") && err.hasOwnProperty("msg"))
    res.status(err.status).send({ status: err.status, msg: err.msg });
});

app.use((err, req, res, next) => {
  console.log(err, "this is an error");
  res.status(500).send({ msg: "this link does not exists" });
});

module.exports = app;
