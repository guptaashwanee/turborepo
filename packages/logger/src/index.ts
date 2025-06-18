import pino from "pino";

const logger = pino();
export const loggerWithTimestamp = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:standard",
			ignore: "pid,hostname",
		},
	},
});

export default logger;
