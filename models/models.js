const db = require("../../be-nc-games/db/connection.js");

exports.selectTreasures = (sort_by = "age", order_by = "ASC", colour) => {
  const validSortColumns = ["age", "cost_at_auction", "shop_name"];
  const validOrder = ["ASC", "DESC"];

  let queryStr = `SELECT treasure_id, treasure_name, colour, age, cost_at_auction, shop_name FROM treasures INNER JOIN shops ON treasures.shop_id = shops.shop_id`;

  const queryValues = [];

  if (colour) {
    queryStr += ` WHERE colour = $1`;
    queryValues.push(colour);
  }

  if (!validSortColumns.includes(sort_by) || !validOrder.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  queryStr += ` ORDER BY ${sort_by} ${order_by};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows;
  });
};

exports.insertTreasures = newTreasure => {
  // const {} = newTreasure
  return db
    .query(
      `INSERT INTO treasures
        (treasure_name, colour, age, cost_at_auction, shop_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [
        newTreasure.treasure_name,
        newTreasure.colour,
        newTreasure.age,
        newTreasure.cost_at_auction,
        newTreasure.shop_id,
      ]
    )
    .then(result => {
      return result.rows[0];
    });
};
