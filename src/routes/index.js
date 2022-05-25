import { Router } from "express";
import login from "../controllers/login";
import { register } from "../controllers/register"
import user from "../controllers/user";
import { isUser } from "../middlewares/auth";
import { validateEmail, validatePassword, validateUser } from "../middlewares/register";

export default (database) => {
	const app = Router()

	app.post(
		"/api/v1/auth/register",
		validateEmail,
		validatePassword, 
		validateUser, 
		register(database)
	)

	app.post(
		"/api/v1/auth/login",
		validateEmail,
		validatePassword,
		login(database)
	)

	app.get(
		"/api/v1/auth/me",
		isUser,
		user(database)
	)
	
	return app
}
