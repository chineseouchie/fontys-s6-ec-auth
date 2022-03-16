import makeApp from "../src/app"
import request from "supertest"
import bcrypt from "bcrypt"

const findOneAuthByEmail = jest.fn()
const spyCompare = jest.spyOn(bcrypt, "compare");

const app = makeApp({
	findOneAuthByEmail,
})

afterEach(() => {    
	jest.resetAllMocks();
});

describe("POST /api/v1/login", () => {
	describe("Given email and password", () => {
		test("should return JWT when login credentials are valid", async () => {
			spyCompare.mockResolvedValue(true)
			findOneAuthByEmail.mockResolvedValue([{email: "", hashedPassword:"Password1!"}, null])
			
			const res = await request(app).post("/api/v1/login").send({
				email: "example@example.com",
				password: "Password1!",
			})

			expect(findOneAuthByEmail.mock.calls.length).toBe(1)
			expect(res.statusCode).toBe(200)
			expect(res.body.data.jwt).toBeDefined()
		})

		test("should return 401 status code if login credentials are not correct", async () => {
			findOneAuthByEmail.mockResolvedValue([{email: "", hashedPassword:"test"}, null])
			const res = await request(app).post("/api/v1/login").send({
				email: "example@example.com",
				password: "Password12!",
			})

			expect(res.statusCode).toBe(401)
			expect(res.body.message).toBe("Incorrect username or password")
		})

		test.skip("should return 400 status code if email is not valid", async () => {
			const res = await request(app).post("/api/v1/login").send({
				email: "em",
				password: "Password1!",
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Invalid email")
		})

		
	})

	
})
