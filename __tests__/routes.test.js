const request = require("supertest");
const app = require("../server/app");

// describe("Test the root path", () => {
//   test("It should response the GET method", async () => {
//     const response = await request(app).get("/");
//     expect(response.statusCode).toBe(200);
//     // expect(response.body.length).toBe(1);
//   });
// });

describe("Test the registration with valid user", () => {
  test("It should response the token", async done => {
    const response = await request(app)
      .post("/register")
      .send({ email: "testuser@jest.com", password: "test123" });
    console.log(response.body.token);
    console.log(response.body.user);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
    done();
  });
});
