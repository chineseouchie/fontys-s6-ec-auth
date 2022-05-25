import { json200, json409, json500 } from "../response/json"

export default function user(database) {
	return async function (req, res) {
		const uuid = res.locals.uuid;
		const [user, error] = await database.getUserFromAuthUuid(uuid)

		console.log(user)


		return json200(
			res,
			"User",
			user
		)
	}
}
