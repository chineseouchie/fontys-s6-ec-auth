import jwt from "jsonwebtoken";

export function generateToken(user) {
	return jwt.sign(
		{
			uuid: user.uuid
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE
		}
	)
}
