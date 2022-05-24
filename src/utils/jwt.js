import jwt from "jsonwebtoken";

export function generateToken(user, roles) {
	return jwt.sign(
		{
			uuid: user.uuid,
			roles: roles
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE
		}
	)
}
