
import { json200, json400, json409, json500 } from "../response/json"
import { isValidEmail } from "../utils/utils"
import bcrypt from "bcrypt"

export function register(database) {
	return async function(req, res) {
		if (!database) {
			return json500(
				res,
				"Database is offline or not connected"
			)
		}

		const {email, password} = req.body

		if (!email || !password) {
			return json400(
				res,
				"Missing data",
			)
		}

		if (!isValidEmail(email)) {
			return json400(
				res,
				"Email or password are invalid"
			)
		}

		const [emailExist, error1] = await database.emailExist(email)
		if (error1) {
			return json500(
				res,
				"Something went wrong while checking if email exist",
			)
		}
		if (emailExist) {
			return json409(
				res,
				"Email already exist",
			)
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const [data, error2] = await database.register(email, hashedPassword)
		if (error2) {
			return json500(
				res,
				"Database failed when trying to insert a new user",
			)
		}

		const userData = {
			id: data.id,
		}

		

		return json200(res, "Register success", null)
	}
}
