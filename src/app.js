import express from 'express'
import 'dotenv/config'
import routes from './routes'

export default function(database) {
	const app = express()
	app.use(express.json())
	app.use(routes(database))

	return app
}
