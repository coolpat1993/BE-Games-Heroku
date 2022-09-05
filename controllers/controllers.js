const { selectTreasures, insertTreasures } = require("../models/models.js");

exports.testExample = (request, response) => {
  response.status(200).send({ msg: "this is a message" });
};

exports.postTreasures = (request, response, next) => {
  insertTreasures(request.body).then(newTreasure => {
    response.status(201).send({ newTreasure });
  });
};
