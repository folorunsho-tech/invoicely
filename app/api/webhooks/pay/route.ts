import { createPayClient } from "@siyegs/pay-kit";
import { webhookRoute } from "@siyegs/pay-kit/next";
import { prisma } from "@/lib/prisma";
import { queueInvoiceReciept } from "@/lib/queue";

const pay = createPayClient({
	provider: "paystack",
	secretKey: process.env.PAYSTACK_SECRET_KEY!,
});

export const POST = webhookRoute(pay, {
	onEvent: async (event) => {
		if (event.type === "charge.success") {
			// fulfil the order, idempotently keyed on event.reference
		}
	},
});
// 401 bad signature · 400 malformed · 500 if onEvent throws (provider retries) · 200 ok
