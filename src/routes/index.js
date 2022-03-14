import { Router } from 'express';
import { register } from '../controllers/register'

export default (database) => {
	const app = Router()

	app.post('/api/v1/register', register(database))
	
	return app
}
