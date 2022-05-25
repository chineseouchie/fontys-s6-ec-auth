import mysql from "mysql2/promise"
import "dotenv/config"
import LogSpacing from "../utils/logging"
import { v4 as uuidv4} from "uuid"

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	waitForConnections: true,

})

export async function init() {
	try {
		console.log("Connecting with database")
		await pool.getConnection()
		console.log("Connected with database")
		LogSpacing()
	} catch(e) {
		console.log("Failed to connect with database")
		console.log("Reconnecting in 5 seconds")

		setTimeout(() => {
			console.log("Reconnecting...")
			LogSpacing()
			init()
		}, 5000);
	}
}

export async function createNewAccount(email, password, uuid, user) {
	let conn = null;

	try {
		conn = await pool.getConnection()
		await conn.beginTransaction()

		// Create auth account
		const sql = `INSERT INTO auth(email, password, uuid) VALUES(?,?,?)`
		const [rows] = await conn.query(sql, [email, password, uuid])

		// Get corresponding role
		let roleSql = ""
		if (email == "admin@example.com") {
			roleSql = `SELECT * FROM role`;
			const [role1] = await conn.query(roleSql)
			const roleIds = role1.map(e => [rows.insertId, e.role_id])
		
			// Create user role 
			const userRole1 = `INSERT INTO user_role(user_id, role_id) VALUES ?`
			await conn.query(userRole1, [roleIds])
		} else {
			roleSql = `SELECT * FROM role WHERE name = "CUSTOMER"`;
			const [role] = await conn.query(roleSql)
			console.log(role)
			const userRole = `INSERT INTO user_role(user_id, role_id) VALUES(${rows.insertId},${role[0].role_id})`
			await conn.query(userRole)
		}
		
		const userSql = `INSERT INTO user(auth_id, user_uuid,firstname,lastname,street,city,province,country) VALUES(?,?,?,?,?,?,?,?)`
		const [userRow] = await conn.query(userSql, [
			rows.insertId,
			uuidv4(),
			user.firstname,
			user.lastname,
			user.street,
			user.city,
			user.province,
			user.country,
		])
		console.log(userRow)

		await conn.commit()
		return [null]
	} catch (e) {
		if (conn) await conn.rollback();
		return [e]
	} finally {
		if (conn) conn.release();
	}
}

export async function emailExist(email) {
	try {
		const sql = "SELECT COUNT(email) AS user_count FROM auth WHERE email = ?"
		const [rows,] = await pool.query(sql, [email])
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
		const [rows,] = await pool.query(sql, [email])

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

export async function getRolesFromUser(auth_id) {
	try {
		const sql = `SELECT r.name, r.role_id FROM role as r
		INNER JOIN user_role AS ur ON r.role_id = ur.role_id
		WHERE ur.USER_ID = ?;`

		const [rows,] = await pool.query(sql, [auth_id])
		
		if (rows.length >= 1 ){
			return [rows, null]
		} else {
			return [null, null]

		}
	} catch (e) {
		console.error(e)
		return [null, e]
	}
}
export async function getUserFromAuthUuid(uuid) {
	try {
		const sql = `SELECT  firstname, lastname, street, city, province, country FROM user as u 
		INNER JOIN auth ON auth.auth_id = u.auth_id
		WHERE auth.uuid = ?`

		const [rows] = await pool.query(sql, [uuid])
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
