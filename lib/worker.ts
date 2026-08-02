/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker, Job } from "bullmq";
import {
	sendInvoiceEmail,
	sendCancellationEmail,
	// sendReminderEmail,
	sendInvoiceUpdatedEmail,
	sendRecieptEmail,
} from "./email";
import { prisma } from "./prisma";
import { redisConnection } from "./queue";
import { createClient } from "redis";

const init = createClient({
	// url: process.env.REDIS_URL,
}).on("error", (err) => console.log("Redis Client Error", err));

const client = await init.connect();

// ─── Handlers ────────────────────────────────────────────────────────────────
async function handleSendInvoice(job: Job) {
	const { invoiceId, organizationId } = job.data;

	const invoice = await prisma.invoice.findUnique({
		where: { id: invoiceId, organizationId: organizationId },
		include: { client: true, items: true, organization: true },
	});

	if (!invoice) throw new Error(`Invoice ${invoiceId} not found`);

	// Bail if cancelled before this job was picked up
	if (invoice.status === "CANCELLED") {
		console.log(`[send-invoice] Invoice ${invoiceId} is cancelled — skipping`);
		return;
	}

	// Bail if dratf before this job was picked up
	if (invoice.status === "DRAFT") {
		console.log(`[send-invoice] Invoice ${invoiceId} is draft — skipping`);
		return;
	}
	// Bail if paid before this job was picked up
	if (invoice.status === "PAID") {
		console.log(`[send-invoice] Invoice ${invoiceId} is paid — skipping`);
		return;
	}

	// Idempotency — skip if already successfully sent
	const alreadySent = await prisma.notification.findFirst({
		where: {
			title: `Invoice ${invoice.invoiceNumber} Sent`,
			organizationId: organizationId,
			type: "invoice.sent",
			for: invoiceId,
		},
	});
	if (alreadySent) return;

	try {
		const { success, error }: { success: boolean; error: string } =
			await sendInvoiceEmail({
				to: invoice.client.email,
				invoice,
			});

		if (success) {
			// ✅ Success row
			const notification = await prisma.notification.create({
				data: {
					type: "invoice.sent",
					for: invoiceId,
					title: `Invoice #${invoice.invoiceNumber} Sent`,
					description: `Invoice #${invoice.invoiceNumber} was sent to ${invoice.client.name}`,
					timestamp: new Date(),
					organizationId: organizationId,
					link: `/invoices/${invoice.id}`,
				},
			});
			await client.publish(
				`notifications:${organizationId}`,
				JSON.stringify(notification),
			);

			console.log(
				`[send-invoice] Invoice email for invoice ${invoiceId} sent to ${invoice.client.email}`,
			);
		}
		if (error) {
			console.log(
				`[send-invoice] Invoice email for invoice ${invoiceId} failed to send to ${invoice.client.email}; Reason: ${error}`,
			);
			throw new Error(error);
		}
	} catch (err: any) {
		// ❌ Failure row — still persisted

		const notification = await prisma.notification.create({
			data: {
				type: "invoice.failed",
				for: invoiceId,
				title: `Invoice ${invoice.invoiceNumber} failed to send`,
				description: `Invoice #${invoice.invoiceNumber} failed to send to ${invoice.client.name}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: `/invoices/${invoice.id}`,
			},
		});

		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);

		throw err; // re-throw so BullMQ retries the job
	}
}

async function handleResendInvoice(job: Job) {
	const { invoiceId, organizationId } = job.data;

	const invoice = await prisma.invoice.findUnique({
		where: { id: invoiceId, organizationId: organizationId },
		include: { client: true, items: true, organization: true },
	});

	if (!invoice) throw new Error(`Invoice ${invoiceId} not found`);

	// Bail if cancelled before this job was picked up
	if (invoice.status === "CANCELLED") {
		console.log(`[send-invoice] Invoice ${invoiceId} is cancelled — skipping`);
		return;
	}

	// Bail if dratf before this job was picked up
	if (invoice.status === "DRAFT") {
		console.log(`[send-invoice] Invoice ${invoiceId} is draft — skipping`);
		return;
	}
	// const client = await init.connect();
	try {
		const { success, error }: { success: boolean; error: string } =
			await sendInvoiceEmail({
				to: invoice.client.email,
				invoice,
			});

		if (success) {
			// ✅ Success row
			const notification = await prisma.notification.create({
				data: {
					type: "invoice.sent",
					for: invoiceId,
					title: `Invoice #${invoice.invoiceNumber} Sent`,
					description: `Invoice #${invoice.invoiceNumber} was sent to ${invoice.client.name}`,
					timestamp: new Date(),
					organizationId: organizationId,
					link: `/invoices/${invoice.id}`,
				},
			});
			await client.publish(
				`notifications:${organizationId}`,
				JSON.stringify(notification),
			);

			console.log(
				`[resend-invoice] Invoice email for invoice ${invoiceId} sent to ${invoice.client.email}`,
			);
		}
		if (error) {
			console.log(
				`[resend-invoice] Invoice email for invoice ${invoiceId} failed to send to ${invoice.client.email}; Reason: ${error}`,
			);
			throw new Error(error);
		}
	} catch (err: any) {
		// ❌ Failure row — still persisted

		const notification = await prisma.notification.create({
			data: {
				type: "invoice.failed",
				for: invoiceId,
				title: `Invoice ${invoice.invoiceNumber} failed to send`,
				description: `Invoice #${invoice.invoiceNumber} failed to send to ${invoice.client.name}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: `/invoices/${invoice.id}`,
			},
		});

		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);
		throw err; // re-throw so BullMQ retries the job
	}
}

// ─────────────────────────────────────────────────────────────────────────────

async function handleSendReciept(job: Job) {
	const { receiptId, organizationId } = job.data;

	const receipt = await prisma.invoiceReciept.findUnique({
		where: { id: receiptId, orgId: organizationId },
		include: {
			invoice: {
				include: {
					client: true,
					organization: true,
					items: true,
				},
			},
		},
	});

	if (!receipt) throw new Error(`Receipt ${receiptId} not found`);

	if (receipt.invoice.status !== "PAID") {
		console.log(
			`[send-invoice-reciept] Invoice ${receipt.invoiceId} is not paid — skipping`,
		);
		return;
	}
	// const client = await init.connect();
	try {
		const { success, error }: { success: boolean; error: string } =
			await sendRecieptEmail({
				to: receipt.invoice.client.email,
				receipt,
			});

		if (success) {
			// ✅ Success row
			const notification = await prisma.notification.create({
				data: {
					type: "receipt.sent",
					for: receiptId,
					title: `Receipt for ${receipt.invoice.invoiceNumber} payment Sent`,
					description: `Receipt for ${receipt.invoice.invoiceNumber} payment Sent successfuly to ${receipt.invoice.client.name}`,
					timestamp: new Date(),
					organizationId: organizationId,
					link: null,
				},
			});
			await client.publish(
				`notifications:${organizationId}`,
				JSON.stringify(notification),
			);

			console.log(
				`[send-invoice-receipt] Invoice receipt email for invoice ${receipt.invoiceId} sent to ${receipt.invoice.client.email}`,
			);
		}
		if (error) {
			console.log(
				`[send-invoice-receipt] Invoice receipt email for invoice ${receipt.invoiceId} failed to send to ${receipt.invoice.client.email}; Reason: ${error}`,
			);
			throw new Error(error);
		}
	} catch (err: any) {
		// ❌ Failure row — still persisted

		const notification = await prisma.notification.create({
			data: {
				type: "receipt.failed",
				for: receiptId,
				title: `Receipt for ${receipt.invoice.invoiceNumber} payment failed to Sent`,
				description: `Receipt for ${receipt.invoice.invoiceNumber} payment failed to be sent to ${receipt.invoice.client.name}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: null,
			},
		});

		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);

		throw err; // re-throw so BullMQ retries the job
	}
}

// ─────────────────────────────────────────────────────────────────────────────

async function handleSendPayment(job: Job) {
	const { paymentId, organizationId } = job.data;

	const payment = await prisma.payment.findUnique({
		where: { id: paymentId, orgId: organizationId },
		include: {
			invoice: {
				include: {
					client: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			},
		},
	});

	if (!payment) throw new Error(`payment ${paymentId} not found`);

	if (payment.invoice.status !== "PAID") {
		console.log(
			`[send-invoice-payment] Invoice ${payment.invoiceId} is not paid — skipping`,
		);
		return;
	}
	// const client = await init.connect();
	try {
		const notification = await prisma.notification.create({
			data: {
				type: `payment.${payment.status}`,
				for: paymentId,
				title: `Payment for ${payment.invoice.invoiceNumber} received`,
				description: `Payment for ${payment.invoice.invoiceNumber} received successfuly from ${payment.invoice.client.name}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: `/payments/${payment.id}`,
			},
		});
		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);
		console.log(
			`[send-invoice-payment] Notification for payment for invoice ${payment.invoiceId} published`,
		);
	} catch (err: any) {
		// ❌ Failure row — still persisted

		const notification = await prisma.notification.create({
			data: {
				type: `payment.${payment.status}`,
				for: paymentId,
				title: `Payment for ${payment.invoice.invoiceNumber} ${payment.status}`,
				description: `Payment for ${payment.invoice.invoiceNumber} ${payment.status}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: `/payments/${payment.id}`,
			},
		});
		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);
		throw err; // re-throw so BullMQ retries the job
	}
}

// ─────────────────────────────────────────────────────────────────────────────

async function handleUpdateInvoice(job: Job) {
	const { invoiceId, organizationId } = job.data;

	const invoice = await prisma.invoice.findUnique({
		where: { id: invoiceId, organizationId: organizationId },
		include: { client: true, items: true, organization: true },
	});

	if (!invoice) throw new Error(`Invoice ${invoiceId} not found`);

	// Bail if cancelled before this job was picked up
	if (invoice.status === "CANCELLED") {
		console.log(
			`[send-invoice-update] Invoice ${invoiceId} is cancelled — skipping`,
		);
		return;
	}

	// Bail if draft before this job was picked up
	if (invoice.status === "DRAFT") {
		console.log(
			`[send-invoice-update] Invoice ${invoiceId} is draft — skipping`,
		);
		return;
	}
	// Bail if paid before this job was picked up
	if (invoice.status === "PAID") {
		console.log(
			`[send-invoice-update] Invoice ${invoiceId} is paid — skipping`,
		);
		return;
	}
	// const client = await init.connect();
	try {
		const { success, error }: { success: boolean; error: string } =
			await sendInvoiceUpdatedEmail({
				to: invoice.client.email,
				invoice,
			});

		if (success) {
			// ✅ Success row

			const notification = await prisma.notification.create({
				data: {
					type: "invoice.update",
					for: invoiceId,
					title: `Invoice update for ${invoice.invoiceNumber} Sent`,
					description: `Invoice update for #${invoice.invoiceNumber} was sent to ${invoice.client.name}`,
					timestamp: new Date(),
					organizationId: organizationId,
					link: `/invoices/${invoice.id}`,
				},
			});
			await client.publish(
				`notifications:${organizationId}`,
				JSON.stringify(notification),
			);
			console.log(
				`[send-invoice-update] Invoice email for invoice ${invoiceId} sent to ${invoice.client.email}`,
			);
		}
		if (error) {
			console.log(
				`[send-invoice-update] Invoice email for invoice ${invoiceId} failed to send to ${invoice.client.email}; Reason: ${error}`,
			);
			throw new Error(error);
		}
	} catch (err: any) {
		// ❌ Failure row — still persisted

		const notification = await prisma.notification.create({
			data: {
				type: "invoice.update",
				for: invoiceId,
				title: `Invoice update for ${invoice.invoiceNumber} failed to send`,
				description: `Invoice update for ${invoice.invoiceNumber} failed to send to ${invoice.client.name}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: `/invoices/${invoice.id}`,
			},
		});
		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);
		throw err; // re-throw so BullMQ retries the job
	}
}

// ─────────────────────────────────────────────────────────────────────────────

async function handleSendCancellation(job: Job) {
	const { invoiceId, organizationId } = job.data;

	const invoice = await prisma.invoice.findUnique({
		where: { id: invoiceId, organizationId: organizationId },
		include: { client: true, items: true, organization: true },
	});
	if (!invoice) throw new Error(`Invoice ${invoiceId} not found`);

	// Only send cancellation email if the invoice was previously sent to the client.
	// If it was never sent (e.g. cancelled while still queued), no email is needed.
	if (invoice.status !== "CANCELLED") {
		console.log(
			`[send-cancellation] Invoice ${invoiceId} is not cancelled (status: ${invoice.status}) — skipping`,
		);
		return;
	}

	// Idempotency — skip if already successfully sent
	// const client = await init.connect();
	try {
		const { success, error } = await sendCancellationEmail({
			to: invoice.client.email,
			invoice,
		});
		if (success) {
			// ✅ Success row
			await prisma.invoice.update({
				where: { id: invoiceId, organizationId: organizationId },
				data: { status: "CANCELLED", cancelledAt: new Date() },
			});

			const notification = await prisma.notification.create({
				data: {
					type: "invoice.cancelled",
					for: invoiceId,
					title: `Invoice ${invoice.invoiceNumber} cancellation sent`,
					description: `Invoice cancellation for ${invoice.invoiceNumber} sent successfuly to ${invoice.client.name}`,
					timestamp: new Date(),
					organizationId: organizationId,
					link: `/invoices/${invoice.id}`,
				},
			});
			await client.publish(
				`notifications:${organizationId}`,
				JSON.stringify(notification),
			);
			console.log(
				`[send-cancellation] Cancellation email for invoice ${invoiceId} sent to ${invoice.client.email}`,
			);
		}
		if (error) {
			console.log(
				`[send-cancellation] Invoice email for invoice ${invoiceId} failed to send to ${invoice.client.email}; Reason: ${error}`,
			);
			throw new Error(error);
		}
	} catch (err: any) {
		// ❌ Failure row — still persisted
		const notification = await prisma.notification.create({
			data: {
				type: "invoice.cancelled",
				for: invoiceId,
				title: `Invoice cancellation for ${invoice.invoiceNumber} failed to send`,
				description: `Invoice cancellation for ${invoice.invoiceNumber} failed to send to ${invoice.client.name}`,
				timestamp: new Date(),
				organizationId: organizationId,
				link: `/invoices/${invoice.id}`,
			},
		});
		await client.publish(
			`notifications:${organizationId}`,
			JSON.stringify(notification),
		);

		throw err; // re-throw so BullMQ retries the job
	}
}

// ─────────────────────────────────────────────────────────────────────────────

// async function handleSendReminder(job: Job) {
// 	const { invoiceId, reminderType, organizationId } = job.data; // e.g. 'reminder_3day'

// 	// Idempotency — check if this exact notification was already sent
// 	const alreadySent = await prisma.invoiceNotification.findFirst({
// 		where: {
// 			invoiceId,
// 			orgId: organizationId,
// 			type: reminderType,
// 			status: "SENT",
// 		},
// 	});

// 	if (alreadySent) {
// 		console.log(
// 			`[send-reminder] ${reminderType} already sent for invoice ${invoiceId} — skipping`,
// 		);
// 		return;
// 	}

// 	const invoice = await prisma.invoice.findUnique({
// 		where: { id: invoiceId, organizationId: organizationId },
// 		include: { client: true, organization: true, items: true },
// 	});

// 	if (invoice?.status === "PAID" || invoice?.status === "CANCELLED") return;

// 	try {
// 		const { success, error } = await sendReminderEmail({
// 			to: invoice?.client.email,
// 			invoice,
// 			reminderType,
// 		});

// 		if (success) {
// 			await prisma.invoiceNotification.create({
// 				data: {
// 					invoiceId,
// 					orgId: organizationId,
// 					type: reminderType,
// 					recipientEmail: invoice?.client.email || "",
// 					status: "SENT",
// 					sentAt: new Date(),
// 				},
// 			});
// 		}
// 		if (error) {
// 			console.log(
// 				`[send-reminder-${reminderType}] Invoice email for invoice ${invoiceId} failed to send to ${invoice?.client.email}; Reason: ${error}`,
// 			);
// 			throw new Error(error);
// 		}
// 	} catch (err: any) {
// 		await prisma.invoiceNotification.create({
// 			data: {
// 				invoiceId,
// 				orgId: organizationId,
// 				type: reminderType,
// 				status: "FAILED",
// 				lastError: err?.message,
// 				recipientEmail: invoice?.client.email || "",
// 			},
// 		});
// 		throw err; // re-throw so BullMQ retries the job
// 	}
// }

// ─── Worker ──────────────────────────────────────────────────────────────────

const worker = new Worker(
	"invoice-queue",
	async (job: Job) => {
		switch (job.name) {
			case "send-invoice":
				return handleSendInvoice(job);
			case "send-invoice-payment":
				return handleSendPayment(job);
			case "send-invoice-receipt":
				return handleSendReciept(job);
			case "send-invoice-update":
				return handleUpdateInvoice(job);
			case "send-cancellation":
				return handleSendCancellation(job);
			case "resend-invoice":
				return handleResendInvoice(job);
			default:
				throw new Error(`Unknown job name: ${job.name}`);
		}
	},
	{
		connection: redisConnection,
		concurrency: 5,
	},
);

worker.on("progress", (job: Job) => {
	console.log(`[worker] Job ${job.id} (${job.name}) progress`);
});
worker.on("completed", (job: Job) => {
	console.log(`[worker] Job ${job.id} (${job.name}) completed`);
});

worker.on("failed", async (job, err) => {
	// job.attemptsMade equals job.opts.attempts when fully exhausted
	if (Number(job?.attemptsMade) >= Number(job?.opts.attempts)) {
		console.error(
			`[worker] Job ${job?.id} (${job?.name}) permanently failed after ${job?.attemptsMade} attempts:`,
			err.message,
		);

		// Optionally alert yourself — Slack, PagerDuty, email to internal team, etc.
		// await notifyInternalTeam({
		//   subject: `Invoice email permanently failed`,
		//   invoiceId: job.data.invoiceId,
		//   jobName: job.name,
		//   error: err.message,
		// });
	}
});
console.log("Worker started!");

export default worker;
