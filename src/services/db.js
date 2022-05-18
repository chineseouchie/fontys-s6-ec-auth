import mysql from "mysql2/promise"
import "dotenv/config"

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	waitForConnections: true,

})

export async function init() {

}

export async function createNewAccount(email, password, uuid) {
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
			roleSql = `SELECT * FROM role WHERE name = "ADMIN"`;
			const [role1] = await conn.query(roleSql)
		
			// Create user role 
			const userRole1 = `INSERT INTO user_role(user_id, role_id) VALUES(${rows.insertId},${role1[0].role_id})`
			await conn.query(userRole1)

			roleSql = `SELECT * FROM role WHERE name = "EMPLOYEE"`;
			const [role2] = await conn.query(roleSql)
		
			// Create user role 
			const userRole2 = `INSERT INTO user_role(user_id, role_id) VALUES(${rows.insertId},${role2[0].role_id})`
			await conn.query(userRole2)
		} else {
			roleSql = `SELECT * FROM role WHERE name = "USER"`;
			const [role] = await conn.query(roleSql)
			const userRole = `INSERT INTO user_role(user_id, role_id) VALUES(${rows.insertId},${role[0].role_id})`
			await conn.query(userRole)
		}
		

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
