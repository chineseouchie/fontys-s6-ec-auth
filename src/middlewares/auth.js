import jsonwebtoken from "jsonwebtoken";
import { json401, json409 } from "../response/json";

export async function isUser(req, res, next) {
	const token = req.headers.authorization;
	if (!token) {
		console.log("Missing JWT token")
		return json409(res, "Login to proceed")
	}

	const jwt = token.split(" ")[1]

	if (!jwt) {
		return json401(res, "Login required")
	}

	try {
		const token = jsonwebtoken.verify(jwt, process.env.JWT_SECRET)
		res.locals.uuid = token.uuid;
		next()
	} catch (e) {
		return json401(res, "Login required")
	}

}
