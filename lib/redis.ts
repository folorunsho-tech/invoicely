import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | undefined;

export async function getRedisClient() {
	if (!client) {
		client = createClient({
			url: process.env.REDIS_URL,
		}).on("error", (err) => console.log("Redis Client Error", err));
		await client.connect();
	}
	return client;
}
