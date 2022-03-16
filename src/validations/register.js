import { json400 } from "../response/json"
import { isValidEmail, isValidPassword } from "../utils/utils"

export function validateRegister(req, res, next) {
	const {email, password, firstname, lastname} = req.body
	if (!email) {
		return json400(
			res,
			"Missing email",
		)
	}

	if (!password) {
		return json400(
			res,
			"Missing password",
		)
	}

	if (!isValidEmail(email)) {
		return json400(
			res,
			"Invalid email"
		)
	}

	if (!isValidPassword(password)) {
		return json400(
			res,
			"Invalid password"
		)
	}

	if (!firstname) {
		return json400(
			res,
			"Missing firstname"
		)
	}

	if (!lastname) {
		return json400(
			res,
			"Missing lastname"
		)
	}

	next()
}
