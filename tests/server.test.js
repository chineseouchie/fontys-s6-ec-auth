import makeApp from '../src/app'
import request from 'supertest'

const register = jest.fn()
const emailExist = jest.fn()

const app = makeApp({
	register,
	emailExist
})

describe('POST /api/v1/register', () => {
	describe('Given an email, password, name and address details', () => {
		test('should save the email and password to the database', async () => {
			emailExist.mockResolvedValue([false, null])
			register.mockResolvedValue([{}, null])
			
			const res = await request(app).post('/api/v1/register').send({
				email: 'email',
				password: 'password'
			})

			expect(register.mock.calls.length).toBe(1)
			expect(res.statusCode).toBe(200)
		})

		test('should return 409 status code if email already exist', async () => {
			emailExist.mockResolvedValue([true, null])

			const res = await request(app).post('/api/v1/register').send({
				email: 'emailExist',
				password: 'password'
			})

			expect(emailExist.mock.calls.length).toBe(1)
			expect(res.statusCode).toBe(409)
			expect(res.body.message).toBe('email already exist')
		})

		test('should return 400 status code if email or password data are invalid', async () => {
			const res = await request(app).post('/api/v1/register').send({
				email: 'em',
				password: 'password'
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe('Email or password are invalid')
		})

		test('should return 500 status code when database failed', async () => {
			emailExist.mockResolvedValue([false, null])
			register.mockResolvedValue([{}, 'error'])
			const res = await request(app).post('/api/v1/register').send({
				email: 'email',
				password: 'password'
			})

			expect(res.statusCode).toBe(500)
			expect(res.body.message).toBe('Email or password are invalid')
			expect(res.body.debug).toBe('Database failed when trying to insert a new user')
		})
		
	})

	describe('Given no register data', () => {
		test('should return 400 status code if missing data', async () => {

			const res = await request(app).post('/api/v1/register').send({
			})

			expect(res.statusCode).toBe(400)
			expect(res.body.message).toBe('Missing data')
		})
	})
})
