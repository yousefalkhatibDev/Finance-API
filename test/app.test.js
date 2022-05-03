const routes = require("../routers/routes")
const supertest = require("supertest")
const request = supertest(routes)

async function test_app() {
    describe("test app", () => {
        it("should return 200", async () => {
        const response = await request.get("/test")
        expect(response.status).toBe(200)
        })
    })
}

// describe("/test endpoint", () => {
//     it("should return a response", async () => {
//         const response = await request.get("/test")
//         expect(response.status).toBe(200)
//         expect(response.text).toBe("Hello world");
//     })
// })