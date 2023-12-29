const { exec } = require("child_process");
const config = require("../utils/config");
const request = require("supertest");
const app = require("../app");
const sequelize = require("../utils/database");

let adminAuthToken;

beforeAll(async () => {
  // Run seed script
  await new Promise((resolve, reject) => {
    const child = exec("node ./seeders/seed.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing seed script: ${error}`);
        reject(error);
      } else {
        console.log(`Seed script output: ${stdout}`);
        resolve();
      }
    });
  });

  // login admin
  const adminResponse = await request(app).post("/api/users/login").send({
    email: config.adminEmail,
    password: config.adminPassword,
  });

  adminAuthToken = adminResponse._body.data.token;
});

describe("CRUD Operations on /api/users", () => {
  it("should allow an admin to register a user", async () => {
    const response = await request(app)
      .post("/api/users/add")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .send({
        name: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
      });

    expect(response.status).toBe(201);
    expect(response._body.data.user).toHaveProperty("name");
    expect(response._body.data.user).toHaveProperty("email");
    expect(response._body._msg).toBe("User added successfully");
  });
});

describe("CRUD Operations on /api/links", () => {
  it("should allow an admin to add a link", async () => {
    const response = await request(app)
      .post("/api/links/create-link")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .send({
        name: "anicon",
        icon: "thumbs up",
        url: "https://www.college.africa",
      });

    expect(response.status).toBe(201);
    expect(response._body.data.link).toHaveProperty("name");
    expect(response._body.data.link).toHaveProperty("icon");
    expect(response._body.data.link).toHaveProperty("url");
    expect(response._body._msg).toBe("Link created successfully");
  });

  it("should allow users to view all links", async () => {
    const response = await request(app).get("/api/links/");

    expect(response.status).toBe(200);
    expect(response._body.data.links[0]).toHaveProperty("name");
    expect(response._body.data.links[0]).toHaveProperty("icon");
    expect(response._body.data.links[0]).toHaveProperty("url");
    expect(response._body._msg).toBe("All links in the db");
  });

  it("should allow users to view a single link", async () => {
    const linkId = "1";
    const response = await request(app).get(`/api/links/${linkId}`);

    expect(response.status).toBe(200);
    expect(response._body.data.links).toHaveProperty("name");
    expect(response._body.data.links).toHaveProperty("icon");
    expect(response._body.data.links).toHaveProperty("url");
    expect(response._body.data.links.id).toBe(1);
    expect(response._body._msg).toBe("A single link in the db");
  });

  it("should allow an admin to update a link", async () => {
    const linkId = "1";
    const response = await request(app)
      .put(`/api/links/${linkId}`)
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .send({
        name: "anicon1",
        icon: "thumbs up1",
        url: "https://www.college.africa1",
      });

    expect(response.status).toBe(200);
    expect(response._body._msg).toBe("Link updated successfully");
  });

  it("should allow an admin to delete a link", async () => {
    const linkId = "1";
    const response = await request(app)
      .delete(`/api/links/${linkId}`)
      .set("Authorization", `Bearer ${adminAuthToken}`);

    expect(response.status).toBe(204);
  });
});

afterAll(async () => {
  await sequelize.close();
});
