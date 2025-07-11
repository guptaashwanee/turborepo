import logger from "@anscer/logger";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	logger.info("Received a request at the root endpoint");
	return c.text("Hello Hono!");
});

app.get("/health", (c) => {
	return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;

logger.info(`Starting server on port ${port}`);

export default {
	port,
	fetch: app.fetch,
};
