const request = require("supertest");
const app = require("../server/app");
const passwordHash = require("password-hash");

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the user registration", () => {
  test("It should send the token and registered user for the newly registered user", async done => {
    const response = await request(app)
      .post("/register")
      .send({ email: "testuser@jest.com", password: "test123" });
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe("testuser@jest.com");
    let isPasswordCorrect = passwordHash.verify(
      "test123",
      response.body.user.password
    );
    expect(isPasswordCorrect).toBeTruthy();
    _id = response.body.user._id;
    done();
  });

  test("It should send error message for the already registered user", async done => {
    const response = await request(app)
      .post("/register")
      .send({ email: "testuser@jest.com", password: "test123" });
    expect(response.body.error).toBe("User already exists!");
    done();
  });
});

describe("Test the user login", () => {
  afterAll(() => {
    return removeUserFromDB("testuser@jest.com");
  });

  test("It should send the token for the valid logged user", async done => {
    const response = await request(app)
      .post("/login")
      .send({ email: "testuser@jest.com", password: "test123" });
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe("testuser@jest.com");
    let isPasswordCorrect = passwordHash.verify(
      "test123",
      response.body.user.password
    );
    expect(isPasswordCorrect).toBeTruthy();
    done();
  });
});

async function removeUserFromDB(email) {
  return await request(app).get(`/deleteUser/${email}`);
}
