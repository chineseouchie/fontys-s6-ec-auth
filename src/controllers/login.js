import bcrypt from "bcrypt"
import { json200, json400, json401 } from "../response/json"
import { generateToken } from "../utils/utils"

export default function login(database) {
	return async function(req, res) {
		const {email, password} = req.body

		const [user, error1] = await database.findOneAuthByEmail(email)
		const isSamePassword = await bcrypt.compare(password, user.hashedPassword)
		
		if (!isSamePassword) {
			return json401(
				res,
				"Incorrect username or password"
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
