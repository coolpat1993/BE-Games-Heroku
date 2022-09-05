const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) return db.end();
});

describe("GET test example", () => {
  it("should return status: 200 - message object", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({ msg: "this is a message" });
      });
  });
});

describe("GET api/categories", () => {
  it("should return status: 200, and an array of catagory objects containing the correct keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(response => {
        const categories = response.body.categories;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach(category => {
          expect(category).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});
