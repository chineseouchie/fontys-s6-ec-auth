import { json400 } from "../response/json"
import { isValidEmail } from "../utils/utils"

export function validateRegister(req, res, next) {
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
			"Invalid email"
		)
	}

	next()
}
