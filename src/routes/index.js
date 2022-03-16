import { Router } from "express";
import login from "../controllers/login";
import { register } from "../controllers/register"
import { validateRegister } from "../validations/register";

export default (database) => {
	const app = Router()

	app.post("/api/v1/register", validateRegister, register(database))
	app.post("/api/v1/login", login(database))
	
	return app
}
