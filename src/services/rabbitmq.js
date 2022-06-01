import amqp from "amqplib"
import jsonwebtoken from "jsonwebtoken"
import "dotenv/config"
import * as Sentry from "@sentry/node";

// Importing @sentry/tracing patches the global hub for tracing to work.
import "@sentry/tracing";
import LogSpacing from "../utils/logging";

const host = process.env.RABBITMQ_HOST
const user = process.env.RABBITMQ_USER
const password = process.env.RABBITMQ_PASSWORD 
let channel
let attempt = 0

export async function init() {
	console.log("Connecting with RabbitMQ...")
	try {
		const conn = await amqp.connect(`amqp://${user}:${password}@${host}:5672`)

		// conn.on("error", (err)=>{console.log(err, "failed")})
		channel = await conn.createChannel()
		console.log("Connected with RabbitMQ")
		LogSpacing()
		validateUser()

	} catch(e) {
		console.log("Failed to connect with RabbitMQ")
		console.log(e)
		setTimeout(() => {
			attempt += 1
			if (attempt < 5) {
				console.log(`Trying to reconnect with RabbitMQ. Attempt: #${attempt}`)
				init()
			} else {
				// const transaction = Sentry.startTransaction({
				// 	op: "RabbitMQ connection failed",
				// 	name: "ec-auth <--> rabbitmq",
				// });
				// Sentry.captureException(e)
				// transaction.finish()
				console.log("Failed to reconnect with RabbitMQ.")				
			}
		}, 1000);
		LogSpacing()
	}
}

export async function validateUser() {
	const queue = "rpc_auth_queue"

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

export async function userRegistered(userData) {
	const ex = "ex_auth_register"
	
	await channel.assertExchange(ex,"topic", {durable: false})
	channel.publish(ex, "auth.register", Buffer.from(JSON.stringify(userData)))
	console.log("New user registered")

}
