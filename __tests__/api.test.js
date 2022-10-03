const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

const input = { created_at: Date.now() };
let currentTime = JSON.stringify(
  convertTimestampToDate(input).created_at
).substring(1, 18);

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) return db.end();
});

reviewObject = {
  review_id: expect.any(Number),
  title: expect.any(String),
  category: expect.any(String),
  designer: expect.any(String),
  owner: expect.any(String),
  review_img_url: expect.any(String),
  created_at: expect.any(String),
  votes: expect.any(Number),
  comment_count: expect.any(String),
};

reviewObjectBody = {
  review_id: expect.any(Number),
  title: expect.any(String),
  category: expect.any(String),
  designer: expect.any(String),
  owner: expect.any(String),
  review_img_url: expect.any(String),
  review_body: expect.any(String),
  created_at: expect.any(String),
  votes: expect.any(Number),
  comment_count: expect.any(Number),
};

describe("GET api/", () => {
  it("should return status: 200 - returns a description of how the api works", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(response => {
        expect(response.body["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
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

describe("GET /api/reviews/:review_id", () => {
  test("status:200, responds with a single matching review", () => {
    const review_id = 2;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: review_id,
          title: "Jenga",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: "dexterity",
          review_body: "Fiddly fun for all the family",
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

describe("GET /api/users", () => {
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

describe("PATCH /api/reviews/:review_id", () => {
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
  it("status:400, responds with an error when incorrect data type us used", () => {
    const updatedVote = { inc_votes: "sdf" };
    return request(app)
      .patch("/api/reviews/3")
      .send(updatedVote)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "SQL ERROR invalid user data input",
        });
      });
  });
  it("status:400, Bad request when review data unavaliable <", () => {
    const updatedVote = { inc_votes: 5 };
    return request(app)
      .patch("/api/reviews/3000")
      .send(updatedVote)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "This data is unreachable at this time",
        });
      });
  });
  it("status:400, responds with an error when incorrect data format is used", () => {
    const updatedVote = { votes: 5 };
    return request(app)
      .patch("/api/reviews/3")
      .send(updatedVote)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "invalid/missing POST data",
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("status:200, responds with every review in DESC order", () => {
    return request(app)
      .get(`/api/reviews`)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toEqual(13);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        body.reviews.forEach(body => {
          expect(body).toEqual(expect.objectContaining(reviewObject));
        });
      });
  });
  test("status:200, responds with every sorted review", () => {
    return request(app)
      .get(`/api/reviews?sort_by=review_id`)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toEqual(13);
        expect(body.reviews).toBeSortedBy("review_id", {
          descending: true,
        });
        body.reviews.forEach(body => {
          expect(body).toEqual(expect.objectContaining(reviewObject));
        });
      });
  });
  test("status:200, responds with every review sorted by review_id in ASC order", () => {
    return request(app)
      .get(`/api/reviews?order_by=ASC&sort_by=review_id`)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toEqual(13);
        expect(body.reviews).toBeSortedBy("review_id", {
          descending: false,
        });
        body.reviews.forEach(body => {
          expect(body).toEqual(expect.objectContaining(reviewObject));
        });
      });
  });
});

describe("GET /api/reviews where filter matches query", () => {
  it("should return an array of objects only containg matched query column value -- category", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body }) => {
        const output = body.reviews;
        expect(output.length >= 1).toEqual(true);
        const filteredOutput = output.filter(
          review => review.category === "social deduction"
        );
        expect(output).toEqual(filteredOutput);
      });
  });
  it("should return an array of objects only containg matched query column value -- owner", () => {
    return request(app)
      .get("/api/reviews?owner=mallionaire")
      .expect(200)
      .then(({ body }) => {
        const output = body.reviews;
        const filteredOutput = output.filter(
          review => review.owner === "mallionaire"
        );
        expect(output).toEqual(filteredOutput);
      });
  });
  it("should return an array of objects only containg matched query column value -- votes", () => {
    return request(app)
      .get("/api/reviews?votes=5")
      .expect(200)
      .then(({ body }) => {
        const output = body.reviews;
        const filteredOutput = output.filter(review => review.votes === 5);
        expect(output).toEqual(filteredOutput);
      });
  });
  it("should return an array of objects only containg every matched query column value and is ordered by review_id ascending", () => {
    return request(app)
      .get(
        "/api/reviews?votes=5&category=ocial&owner=mallionaire&sort_by=review_id&order_by=ASC&"
      )
      .expect(200)
      .then(({ body }) => {
        const output = body.reviews;
        expect(output.length).toEqual(2);
        expect(output).toBeSortedBy("review_id", {
          descending: false,
        });
        expect(output[(0, 1)]).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            category: "social deduction",
            designer: expect.any(String),
            owner: "mallionaire",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: 5,
            comment_count: expect.any(String),
          })
        );
      });
  });
  it("should return 400: not found when input contains category items that is not a property value", () => {
    return request(app)
      .get("/api/reviews?category=somethingIsWrongHere")
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "There were no reviews with those parameters",
        });
      });
  });
  it("should return 400: bad request when query name is incorrect", () => {
    return request(app)
      .get("/api/reviews?thisIsIncorrect=5&sort_by=title")
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "bad request",
        });
      });
  });
});

describe("GET api/reviews/:review_id/comments", () => {
  it("should return 200: responds with a comment object based on review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(response => {
        expect(response.body.comments.length).toEqual(3);
        expect(response.body.comments[0]).toEqual({
          author: "bainesface",
          body: "I loved this game too!",
          comment_id: 1,
          created_at: "2017-11-22T12:43:33.389Z",
          review_id: 2,
          votes: 16,
        });
      });
  });
  it("should return 400: Error when reviews/:review_id is not a number", () => {
    return request(app)
      .get("/api/reviews/notNumber/comments")
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "SQL ERROR invalid user data input",
        });
      });
  });
  it("should return 400: Error when review does not exist", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "This review was not found",
        });
      });
  });
  it("should return 200: Error when review does exist but the comment does not exist", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          status: 200,
          msg: "This comment was not found",
        });
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("should return 201: responds with and object containing the correct keys", () => {
    const newComment = {
      body: "My dog loved this game too!",
      author: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.newComment;
        expect.objectContaining({
          comment_id: expect.any(Number),
          body: expect.any(String),
          review_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });

        expect(comment.created_at.substring(0, 17)).toEqual(currentTime);
      });
  });
  it("should return 400: responds with an error that there is no review by this Id", () => {
    const newComment = {
      body: "My dog loved this game too!",
      author: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/14/comments")
      .send(newComment)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "There was no review with this review_id",
        });
      });
  });
  it("should return 400: responds with an error that there is missing post data", () => {
    const newComment = {
      body: "My dog loved this game too!",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "invalid/missing POST data",
        });
      });
  });
  it("should return 400: responds with an error that there is missing post data", () => {
    const newComment = {
      body: "My dog loved this game too!",
      author: "A-RANDOM-USERNAME-THAT-DOESNT-EXIST",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({
          status: 400,
          msg: "invalid/missing POST data",
        });
      });
  });
});

describe("4. /api/comments/:comment_id ", () => {
  test("status:204, responds with an empty response body", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("should return 201: responds with and object containing the correct keys", () => {
    const newReview = {
      title: "TestTitle",
      designer: "TestDesigner",
      owner: "mallionaire",
      review_img_url:
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      review_body: "Test review body",
      category: "social deduction",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201)
      .then(({ body }) => {
        const review = body.newReview;
        expect(review).toEqual(expect.objectContaining(reviewObjectBody));
      });
  });
});

describe("GET /api/misc", () => {
  it("should return status: 200, and an array of review properties and a nested Array", () => {
    return request(app)
      .get("/api/misc")
      .expect(200)
      .then(({ body }) => {
        expect(body.misc[5].comments.length).toEqual(3);
      });
  });
});
