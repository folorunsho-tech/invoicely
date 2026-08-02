import { createClient } from "redis";

const init = createClient({
	// url: process.env.REDIS_URL,
}).on("error", (err) => console.log("Redis Client Error", err));

export const client = await init.connect();
