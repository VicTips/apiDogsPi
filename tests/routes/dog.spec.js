/* eslint-disable import/no-extraneous-dependencies */
const session = require("supertest-session");
const server = require("../../src/app.js");

const agent = session(server);

describe("Dogs routes", () => {
  describe("GET /dogs", () => {
    it("should get status 200", () => {
      return agent.get("/api/dog").expect(200);
    });

    it("should return an array with all the dogs", () => {
      agent.get("/api/dog").then((response) => {
        expect(Array.isArray(response.body));
      });
    });
  });

  describe("GET /dogs/:id", () => {
    it("should get status 200", () => {
      return agent.get("/api/dog/3").expect(200);
    });

    it("should return all the details of a certain dog", () => {
      agent.get("/api/dog/3").then((response) => {
        expect(response.body.name).toEqual("African Hunting Dog");
      });
    });

    it("should return an appropriate message if the ID does not exist", () => {
      agent.get("/api/dog/500").then((response) => {
        expect(response.body.id).toEqual("ID not found!");
      });
    });
  });

  describe("POST /dog", () => {
    it("should get status 200", () => {
      agent
        .post("/api/dog/")
        .send({
          name: "Pepe",
          min_height: 20,
          max_height: 30,
          min_weight: 10,
          max_weight: 15,
          life_span: 10,
        })
        .expect(200);
    });
  });
});
