import { json200, json409, json500 } from "../response/json"

export default function user(database) {
	return async function (req, res) {
		const uuid = res.locals.uuid;
		console.log(uuid)



		return json200(
			res,
			"me"
		)
	}
}
