import { Router } from 'express';
import { home } from '../controllers/home'

export default (database) => {
	const app = Router()

	app.get('/api/v1/auth', home(database))
	
	return app
}
