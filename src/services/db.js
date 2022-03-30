import mysql from "mysql2/promise"
import "dotenv/config"
import fs from "fs"

const connection = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	waitForConnections: true,

})

connection.getConnection();

export async function init() {
	try {
		const sql = fs.readFileSync("./schema/002.sql").toString();
		
		await connection.query(sql)

	} catch (e) {
		throw Error(e)
	}
}

export async function register(email, password, uuid) {
	try {
		const sql = `INSERT INTO auth(email, password, uuid) VALUES(?,?,?)`
		const [rows,] = await connection.query(sql, [email, password, uuid])

		const data = {
			id: rows.insertId
		}

		return [data, null]
	} catch (e) {
		return [null, e]
	}

}

export async function emailExist(email) {
	try {
		const sql = "SELECT COUNT(email) AS user_count FROM auth WHERE email = ?"
		const [rows,] = await connection.query(sql, [email])
		if (rows[0].user_count >= 1) {
			return [true, null]
		}

		return [false, null]
	} catch (e) {
		console.error(e)
		return [null, e]
	}
}

export async function findOneAuthByEmail(email) {
	try {
		const sql = "SELECT * FROM auth WHERE email = ?"
		const [rows,] = await connection.query(sql, [email])

		if (rows.length >= 1 ){
			return [rows[0], null]
		} else {
			return [null, null]

		}
	} catch (e) {
		console.error(e)
		return [null, e]
	}
}
