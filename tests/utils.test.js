import { isValidEmail } from "../src/utils/form";

afterEach(() => {
	jest.clearAllMocks();
});

describe("Utils", () => {
	test("for email validity", async () => {
		const email = "example@example.com"
		const result = isValidEmail(email)

		expect(result).not.toBe(null)
	})
})
