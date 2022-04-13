import amqp from "amqplib"
import jsonwebtoken from "jsonwebtoken"

export async function validateUser() {
	const queue = "rpc_auth_queue"

	const conn = await amqp.connect("amqp://joey:root@ec-rabbitmq:5672")
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
