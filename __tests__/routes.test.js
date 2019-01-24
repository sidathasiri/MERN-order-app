const request = require("supertest");
const app = require("../server/app");
const axios = require("axios");

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the registration with valid user", () => {
  test("It should response the token", async done => {
    const response = await request(app)
      .post("/register")
      .send({ email: "testuser@jest.com", password: "test123" });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
    removeUserFromDB(response.body.user._id);
    done();
  });
});

async function removeUserFromDB(_id) {
  await request(app)
    .delete(`/deleteUser/${_id}`)
    .send({ email: "testuser@jest.com", password: "test123" });
}
