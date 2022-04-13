import amqp from "amqplib"
import jsonwebtoken from "jsonwebtoken"
import "dotenv/config"

const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const password = process.env.RABBITMQ_PASSWORD 

export async function validateUser() {
	const queue = "rpc_auth_queue"

	const conn = await amqp.connect(`amqp://${user}:${password}@${host}:5672`)
	const channel = await conn.createChannel()
	channel.assertQueue(queue, {durable: false})
	channel.prefetch(1)
	console.log("RPC Auth online.")

	channel.consume(queue, (msg) => {
		console.log("Token received")
		const jwt = msg.content.toString()

		let response;
		try {
			const token = jsonwebtoken.verify(jwt, process.env.JWT_SECRET)
			response = {token, isValid: true}
		} catch (e) {
			response = {isValid: false}
		}

		channel.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(response)),
			{
				correlationId: msg.properties.correlationId
			}
		);

		channel.ack(msg)
	})
}

export default async function userRegistered(userData) {
	const ex = "ex_auth_register"
	const conn = await amqp.connect(`amqp://${user}:${password}@${host}:5672`)
	const ch = await conn.createChannel()
	await ch.assertExchange(ex,"topic", {durable: false})
	ch.publish(ex, "auth.register", Buffer.from(JSON.stringify(userData)))
	console.log("New user registered")

}
