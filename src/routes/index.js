import { Router } from "express";
import login from "../controllers/login";
import { register } from "../controllers/register"
import { validateEmail, validatePassword, validateUser } from "../validations/register";

export default (database) => {
	const app = Router()

	app.post(
		"/api/v1/register",
		validateEmail,
		validatePassword, 
		validateUser, 
		register(database)
	)

	app.post(
		"/api/v1/login",
		validateEmail,
		validatePassword,
		login(database)
	)
	
	return app
}
