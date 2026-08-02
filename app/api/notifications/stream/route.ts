// app/api/notifications/stream/route.ts
import { NextRequest } from "next/server";
import { getSession, hasPermission } from "@/lib/authlibs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { createClient } from "redis";

export async function GET(req: NextRequest) {
	const init = createClient({
		// url: process.env.REDIS_URL,
	}).on("error", (err) => console.log("Redis Client Error", err));

	const client = await init.connect();
	const data = await getSession();
	const isPermitted = await hasPermission({
		notifications: ["read"],
	});

	if (!data || !isPermitted.success) {
		return new Response("Unauthorized", { status: 401 });
	}

	const encoder = new TextEncoder();
	let closed = false;

	const stream = new ReadableStream({
		async start(controller) {
			function send(chunk: string) {
				if (closed) return;
				try {
					controller.enqueue(encoder.encode(chunk));
				} catch {
					closed = true;
				}
			}

			const heartbeat = setInterval(() => {
				send(": heartbeat\n\n");
			}, 30_000);

			await client.subscribe(
				`notifications:${data.session.activeOrganizationId}`,
				(message) => {
					send(`data: ${message}\n\n`);
				},
			);

			req.signal.addEventListener("abort", async () => {
				closed = true;
				clearInterval(heartbeat);

				await client.unsubscribe(
					`notifications:${data.session.activeOrganizationId}`,
				);

				if (!closed) controller.close(); // ← guarded
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});
}
