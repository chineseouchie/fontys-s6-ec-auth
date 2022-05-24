import bcrypt from "bcrypt"
import { json200, json401, json500 } from "../response/json"
import * as jwt from "../utils/jwt"

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

		const [roles, error2] = await database.getRolesFromUser(user.auth_id)
		if (error2) {
			console.log(error2)
			return json500(res, "Failed to get roles")
		}
		
		const rolesArr = roles.map(e => e.name)

		return json200(
			res,
			"Login success",
			{
				jwt: jwt.generateToken(user, rolesArr)
			}
		)
	}
}
