import makeApp from "../src/app"
import request from "supertest"

const register = jest.fn()
const emailExist = jest.fn()

const app = makeApp({
	register,
	emailExist
})

afterEach(() => {    
	jest.resetAllMocks();
});

describe("POST /api/v1/auth/register", () => {
	describe("Given an email, password, firstname and lastname details", () => {
		// test("should save the email and password to the database", async () => {
		// 	emailExist.mockResolvedValue([false, null])
		// 	register.mockResolvedValue([{}, null])
			
		// 	const res = await request(app).post("/api/v1/auth/register").send({
		// 		email: "example@example.com",
		// 		password: "Password1!",
		// 		firstname: "firstname",
		// 		lastname: "lastname"
		// 	})

		// 	expect(register.mock.calls.length).toBe(1)
		// 	expect(res.statusCode).toBe(200)
		// })

		test("should return 409 status code if email already exist", async () => {
			emailExist.mockResolvedValue([true, null])

			const res = await request(app).post("/api/v1/auth/register").send({
				email: "exampleExist@example.com",
				password: "Password1!",
				firstname: "firstname",
				lastname: "lastname"
			})

			expect(emailExist.mock.calls.length).toBe(1)
			expect(res.statusCode).toBe(409)
			expect(res.body.message).toBe("Email already exist")
		})

		test("should return 500 status code if email check failed", async () => {
			emailExist.mockResolvedValue([true, "error"])

			const res = await request(app).post("/api/v1/auth/register").send({
				email: "exampleExist@example.com",
				password: "Password1!",
				firstname: "firstname",
				lastname: "lastname"
			})

			expect(emailExist.mock.calls.length).toBe(1)
			expect(res.statusCode).toBe(500)
			expect(res.body.message).toBe("Something went wrong")
		})

		test("should return 400 status code if email is not valid", async () => {
			const res = await request(app).post("/api/v1/auth/register").send({
				email: "em",
				password: "Password1!",
				firstname: "firstname",
				lastname: "lastname"
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Invalid email")
		})

		test("should return 400 status code if password is not valid", async () => {
			const res = await request(app).post("/api/v1/auth/register").send({
				email: "example@example.com",
				password: "Password1",
				firstname: "firstname",
				lastname: "lastname"
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Invalid password")
		})

		test("should return 500 status code when database failed", async () => {
			emailExist.mockResolvedValue([false, null])
			register.mockResolvedValue([{}, "error"])
			const res = await request(app).post("/api/v1/auth/register").send({
				email: "example@example.com",
				password: "Password1!",
				firstname: "firstname",
				lastname: "lastname"
			})

			expect(res.statusCode).toBe(500)
			expect(res.body.message).toBe("Something went wrong")
			expect(res.body.debug).toBe("Database failed when trying to insert a new user")
		})
		
	})

	describe("Given no register data", () => {
		test("should return 400 status code if email missing", async () => {

			const res = await request(app).post("/api/v1/auth/register").send({
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Missing email")
		})

		test("should return 400 status code if password missing", async () => {

			const res = await request(app).post("/api/v1/auth/register").send({
				email: "example@example.com"
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Missing password")
		})

		test("should return 400 status code if firstname missing", async () => {
			const res = await request(app).post("/api/v1/auth/register").send({
				email: "example@example.com",
				password: "Password1!",
				lastname: "lastname",
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Missing firstname")
		})

		test("should return 400 status code if lastname missing", async () => {
			const res = await request(app).post("/api/v1/auth/register").send({
				email: "example@example.com",
				password: "Password1!",
				firstname: "firstname"
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe("Missing lastname")
		})
	})
})
