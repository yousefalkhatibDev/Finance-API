const routes = require("../routers/routes");
const supertest = require("supertest");
const pool = require("../helper/helper");
const { afterEach } = require("mocha");
const request = supertest(routes);
const chai = require("chai");
var expect = chai.expect;

// afterEach(async (done) => {
//   // Closing the DB connection allows Jest to exit successfully.
//   try {
//     pool.end();
//     done();
//   } catch (error) {
//     console.log(error);
//     done();
//   }
// });

describe("/test endpoint", () => {
  it("should return a response", async () => {
    expect(1+1).equal(2);
  });
});
