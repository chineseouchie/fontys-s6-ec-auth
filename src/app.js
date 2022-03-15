import express from "express"
import "dotenv/config"
import routes from "./routes"
import cors from "cors"
import bodyParser from "body-parser"

export default function(database) {
	const app = express()
	app.use(cors())
	app.use(bodyParser.json())
	app.use(express.json())
	app.use(routes(database))

	return app
}
