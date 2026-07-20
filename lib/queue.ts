import { InvoiceNotificationType } from "@/generated/prisma/enums";
import { Queue } from "bullmq";
export const redisConnection = {
	host: process.env.REDIS_HOST || "localhost",
	port: Number(process.env.REDIS_PORT) || 6379,
};
const invoiceQueue = new Queue("invoice-queue", {
	connection: redisConnection,
	defaultJobOptions: {
		attempts: 3,
		backoff: { type: "exponential", delay: 5000 },
		removeOnComplete: { count: 100 },
		removeOnFail: { count: 100 },
	},
});

export async function queueInvoiceSend(
	organizationId: string,
	invoiceId: string,
) {
	return await invoiceQueue.add(
		"send-invoice",
		{
			invoiceId,
			organizationId,
		},
		{
			attempts: 3,
			backoff: { type: "exponential", delay: 5000 },
			jobId: `send-invoice-${invoiceId}`,
			removeOnComplete: true,
			removeOnFail: true,
		},
	);
}
export async function queueInvoiceReciept(
	organizationId: string,
	receiptId: string,
) {
	return await invoiceQueue.add(
		"send-invoice-receipt",
		{
			receiptId,
			organizationId,
		},
		{
			attempts: 3,
			backoff: { type: "exponential", delay: 5000 },
			jobId: `send-invoice-receipt-${receiptId}`,
			removeOnComplete: true,
			removeOnFail: true,
		},
	);
}

export async function queueInvoiceUpdateSend(
	organizationId: string,
	invoiceId: string,
) {
	return await invoiceQueue.add(
		"send-invoice-update",
		{
			invoiceId,
			organizationId,
		},
		{
			attempts: 3,
			backoff: { type: "exponential", delay: 5000 },
			jobId: `send-invoice-update-${invoiceId}`,
			removeOnComplete: true,
			removeOnFail: true,
		},
	);
}

export async function queueInvoiceCancellation(
	organizationId: string,
	invoiceId: string,
) {
	return await invoiceQueue.add(
		"send-cancellation",
		{
			invoiceId,
			organizationId,
		},
		{
			attempts: 5,
			backoff: { type: "exponential", delay: 2000 },
			removeOnComplete: true,
			removeOnFail: true,
		},
	);
}

export async function queueInvoiceReminders(
	reminders: {
		invoiceId: string;
		reminderType: InvoiceNotificationType;
		organizationId: string;
		delay?: number;
	}[],
) {
	const rems = reminders?.map((rem) => {
		return {
			name: "send-reminder",
			data: { invoiceId: rem.invoiceId, organizationId: rem.organizationId },
			opts: {
				delay: rem.delay,
				attempts: 2,
				backoff: { type: "exponential", delay: 10000 },
				jobId: `send-${rem.reminderType}-${rem.invoiceId}`,
				removeOnComplete: true,
				removeOnFail: true,
			},
		};
	});

	return await invoiceQueue.addBulk(rems);
}
export async function removeJobsFromInvoiceQueue(invoiceId: string) {
	const ids = [
		`send-REMINDER_7D-${invoiceId}`,
		`send-REMINDER_3D-${invoiceId}`,
		`send-REMINDER_1D-${invoiceId}`,
	];
	ids.forEach((jobId) => {
		return invoiceQueue.remove(jobId, {
			removeChildren: true,
		});
	});
}

export default invoiceQueue;
