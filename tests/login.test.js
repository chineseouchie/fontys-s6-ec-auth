import makeApp from "../src/app"
import request from "supertest"
import bcrypt from "bcrypt"
import * as util from "../src/utils/jwt"

const findOneAuthByEmail = jest.fn()
const getRolesFromUser = jest.fn()
const spyCompare = jest.spyOn(bcrypt, "compare");
const spyJwt = jest.spyOn(util, "generateToken");

const app = makeApp({
	findOneAuthByEmail,
	getRolesFromUser,
})

afterEach(() => {
	jest.resetAllMocks();
});

describe("POST /api/v1/auth/login", () => {
	describe("Given email and password", () => {
		test("should return JWT when login credentials are valid", async () => {
			spyCompare.mockResolvedValue(true)
			spyJwt.mockResolvedValue("testUID")
			findOneAuthByEmail.mockResolvedValue([{ email: "", hashedPassword: "Password1!", uuid: "uuidtest" }, null])
			getRolesFromUser.mockResolvedValue([[{name:"role1"}], null])

			const res = await request(app).post("/api/v1/auth/login").send({
				email: "example@example.com",
				password: "Password1!",
			})

			expect(findOneAuthByEmail.mock.calls.length).toBe(1)
			expect(res.statusCode).toBe(200)
			expect(res.body.data.jwt).toBeDefined()
		})

		test("should return 401 status code if login credentials are not correct", async () => {
			findOneAuthByEmail.mockResolvedValue([{ email: "example@example.com", hashedPassword: "test" }, null])
			const res = await request(app).post("/api/v1/auth/login").send({
				email: "example@example.com",
				password: "Password12!",
			})

			expect(res.statusCode).toBe(401)
			expect(res.body.message).toBe("Incorrect email or password")
		})

		test("should return 400 status code if email is not valid", async () => {
			const res = await request(app).post("/api/v1/auth/login").send({
				email: "em",
				password: "Password1!",
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Invalid email")
		})

		test("should return 500 status code if failed to get user from database", async () => {
			findOneAuthByEmail.mockResolvedValue([{}, "error"])
			const res = await request(app).post("/api/v1/auth/login").send({
				email: "example@example.com",
				password: "Password12!",
			})

			expect(res.statusCode).toBe(500)
			expect(res.body.message).toBe("Something went wrong")
		})
	})

	describe("Given no login data", () => {
		test("should return 400 status code if email missing", async () => {

			const res = await request(app).post("/api/v1/auth/login").send({
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Missing email")
		})

		test("should return 400 status code if password missing", async () => {

			const res = await request(app).post("/api/v1/auth/login").send({
				email: "example@example.com"
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Missing password")
		})
	})

})
