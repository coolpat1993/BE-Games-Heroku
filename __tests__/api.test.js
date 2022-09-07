const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { string } = require("pg-format");

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
          comment_count: "3",
        });
      });
  });
  test("should return 400: not found when input is not a number", () => {
    const review_id = "string";
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "invalid review ID",
        });
      });
  });
  test("should return 404: this review does not yet exist when passed with a number larger than the array length", () => {
    const review_id = 9999;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(404)
      .then(response => {
        expect(response.body).toEqual({
          status: 404,
          msg: "This review was not found",
        });
      });
  });
});

describe("GET api/users", () => {
  it("should return status: 200, and an array of catagory objects containing the correct keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(response => {
        const users = response.body.users;
        expect(users).toHaveLength(4);
        users.forEach(category => {
          expect(category).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("5. PATCH /api/reviews/:review_id", () => {
  it("status:201, responds with the updated review with new votes", () => {
    const updatedVote = { inc_votes: 12 };
    return request(app)
      .patch("/api/reviews/3")
      .send(updatedVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          review_body: "We couldn't find the werewolf!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 17,
          category: "social deduction",
          owner: "bainesface",
          designer: "Akihisa Okui",
          created_at: "2021-01-18T10:01:41.251Z",
        });
      });
  });
  it("status:201, responds with the updated review with new votes", () => {
    const updatedVote = { inc_votes: "sdf" };
    return request(app)
      .patch("/api/reviews/3")
      .send(updatedVote)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "invalid vote data",
        });
      });
  });
});

describe("2. GET /api/reviews", () => {
  test("status:200, responds with every review in DESC order", () => {
    return request(app)
      .get(`/api/reviews`)
      .expect(200)
      .then(({ body }) => {
        let review = body.review;
        expect(review.length).toEqual(13);
        console.log(review);
        expect(review).toBeSortedBy("created_at", {
          descending: true,
        });
        review.forEach(review => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});
