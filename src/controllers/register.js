import { json200, json409, json500 } from "../response/json"
import bcrypt from "bcrypt"
import { v4 as uuidv4} from "uuid"
import userRegistered from "../services/rabbitmq"

export function register(database) {
	return async function(req, res) {
		const {email, password, firstname, lastname, street, city, province, country} = req.body

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

		const userUuid = uuidv4();
		const hashedPassword = await bcrypt.hash(password, 10)
		const [data, error2] = await database.register(email, hashedPassword, userUuid)
		if (error2) {
			return json500(
				res,
				"Database failed when trying to insert a new user",
			)
		}

		// TODO send data to other microservices with rabbitmq
		const userData = {
			user_uuid: userUuid,
			firstname, lastname, street, city, province,country
		}

		await userRegistered(userData)

		return json200(res, "Register success", null)
	}
}
