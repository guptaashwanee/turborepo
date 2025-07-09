import logger from "@anscer/logger";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	logger.info("Received a request at the root endpoint");
	return c.text("Hello Hono!");
});

export default app;
