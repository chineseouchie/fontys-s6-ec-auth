import { Router } from "express";
import { register } from "../controllers/register"
import { validateRegister } from "../validations/register";

export default (database) => {
	const app = Router()

	app.post("/api/v1/register", validateRegister, register(database))
	
	return app
}
