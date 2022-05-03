const routes = require("../routers/routes")
const supertest = require("supertest")
const request = supertest(routes)

describe("/test endpoint", () => {
    it("should return a response", async () => {
        const response = await request.get("/test")
        expect(response.status).toBe(200)
        expect(response.text).toBe("Hello world");
    })
})