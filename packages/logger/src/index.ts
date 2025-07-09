import { pino } from "pino";

export const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:standard",
			ignore: "pid,hostname",
		},
	},
});

export default logger as pino.Logger;
export type Logger = pino.Logger;
