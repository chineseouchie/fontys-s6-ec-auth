import makeApp from "./app"
import * as database from "./services/db"
import "dotenv/config"
import * as rabbitmq from "./services/rabbitmq"

import * as Sentry from "@sentry/node";
Sentry.init({
	dsn: "https://72b795653d784667a94a635b96d6a707@o492790.ingest.sentry.io/6395495",
  
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

  
async function init() {
	await database.init()
	await rabbitmq.init(database)
}

init()

const app = makeApp(database)
const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Auth - port ${port}`))
