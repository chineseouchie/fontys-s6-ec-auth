import makeApp from "./app"
import * as database from "./services/db"
import "dotenv/config"

async function init() {
	await database.init()
}

init()
const app = makeApp(database)
const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Auth - port ${port}`))
