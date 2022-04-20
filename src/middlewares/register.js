import { json400 } from "../response/json"
import * as form from "../utils/form"

export function validateEmail(req, res, next) {
	const {email} = req.body
	if (!email) {
		return json400(
			res,
			"Missing email",
		)
	}

	if (!form.isValidEmail(email)) {
		return json400(
			res,
			"Invalid email"
		)
	}
	next()
}

export function validatePassword(req, res, next) {
	const {password} = req.body
	if (!password) {
		return json400(
			res,
			"Missing password",
		)
	}	

	if (!form.isValidPassword(password)) {
		return json400(
			res,
			"Invalid password"
		)
	}
	next()
}

export function validateUser(req, res, next) {
	const {firstname, lastname} = req.body
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
