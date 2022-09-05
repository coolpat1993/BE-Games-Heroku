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

describe("2. GET /api/reviews/:review_id", () => {
  test("status:200, responds with a single matching review", () => {
    const review_id = 2;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: review_id,
          title: "Jenga",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: "dexterity",
          owner: "philippaclaire9",
          designer: "Leslie Scott",
          created_at: "2021-01-18T10:01:41.251Z",
        });
      });
  });
});
