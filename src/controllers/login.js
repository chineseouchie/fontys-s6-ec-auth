import bcrypt from "bcrypt"
import { json200, json401, json500 } from "../response/json"
import { generateToken } from "../utils/utils"

export default function login(database) {
	return async function (req, res) {
		const { email, password } = req.body

		const [user, error1] = await database.findOneAuthByEmail(email)
		if (error1) {
			return json500(res, "Failed to get email from the database")
		}
		if (user === null) {
			return json401(res, "Incorrect email or password")
		}
		const isSamePassword = await bcrypt.compare(password, user.password)

		if (!isSamePassword) {
			return json401(
				res,
				"Incorrect email or password"
			)
		}

		return json200(
			res,
			"Login success",
			{
				jwt: generateToken(user)
			}
		)
	}
}
