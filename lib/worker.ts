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
			category: "invoice",
			type: "success",
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
			await prisma.notification.create({
				data: {
					title: `Invoice ${invoice.invoiceNumber} Sent`,
					description: `Invoice ${invoice.invoiceNumber} Sent successfuly to ${invoice.client.email}`,
					organizationId: organizationId,
					category: "invoice",
					type: "success",
					link: `/invoices/${invoice.id}`,
				},
			});

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
		await prisma.notification.create({
			data: {
				title: `Invoice ${invoice.invoiceNumber} fail to send`,
				description: `Error - Invoice ${invoice.invoiceNumber} failed to send to ${invoice.client.email}`,
				organizationId: organizationId,
				category: "invoice",
				type: "error",
				link: `/invoices/${invoice.id}`,
			},
		});

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

	try {
		const { success, error }: { success: boolean; error: string } =
			await sendInvoiceEmail({
				to: invoice.client.email,
				invoice,
			});

		if (success) {
			// ✅ Success row
			await prisma.notification.create({
				data: {
					title: `Invoice ${invoice.invoiceNumber} Sent`,
					description: `Invoice ${invoice.invoiceNumber} Sent successfuly to ${invoice.client.email}`,
					organizationId: organizationId,
					category: "invoice",
					type: "success",
					link: `/invoices/${invoice.id}`,
				},
			});

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
		await prisma.notification.create({
			data: {
				title: `Invoice ${invoice.invoiceNumber} fail to send`,
				description: `Error - Invoice ${invoice.invoiceNumber} failed to send to ${invoice.client.email}`,
				organizationId: organizationId,
				category: "invoice",
				type: "error",
				link: `/invoices/${invoice.id}`,
			},
		});

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

	try {
		const { success, error }: { success: boolean; error: string } =
			await sendRecieptEmail({
				to: receipt.invoice.client.email,
				receipt,
			});

		if (success) {
			// ✅ Success row
			await prisma.notification.create({
				data: {
					title: `Receipt for ${receipt.invoice.invoiceNumber} payment Sent`,
					description: `Receipt for ${receipt.invoice.invoiceNumber} payment Sent successfuly to ${receipt.invoice.client.email}`,
					organizationId: organizationId,
					category: "receipt",
					type: "success",
				},
			});

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
		await prisma.notification.create({
			data: {
				title: `Receipt for ${receipt.invoice.invoiceNumber} payment failed to Sent`,
				description: `Receipt for ${receipt.invoice.invoiceNumber} payment failed to be sent to ${receipt.invoice.client.email}`,
				organizationId: organizationId,
				category: "receipt",
				type: "error",
			},
		});

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

	try {
		const { success, error }: { success: boolean; error: string } =
			await sendInvoiceUpdatedEmail({
				to: invoice.client.email,
				invoice,
			});

		if (success) {
			// ✅ Success row
			await prisma.notification.create({
				data: {
					title: `Invoice update for ${invoice.invoiceNumber} Sent`,
					description: `Invoice update for ${invoice.invoiceNumber} Sent successfuly to ${invoice.client.email}`,
					organizationId: organizationId,
					category: "invoice",
					type: "success",
					link: `/invoices/${invoice.id}`,
				},
			});

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
		await prisma.notification.create({
			data: {
				title: `Invoice update for ${invoice.invoiceNumber} failed to send`,
				description: `Error - Invoice update for ${invoice.invoiceNumber} failed to send to ${invoice.client.email}`,
				organizationId: organizationId,
				category: "invoice",
				type: "error",
				link: `/invoices/${invoice.id}`,
			},
		});

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
	const alreadySent = await prisma.notification.findFirst({
		where: {
			title: `Invoice ${invoice.invoiceNumber} cancellation Sent`,
			organizationId: organizationId,
			category: "invoice",
			type: "success",
		},
	});

	if (alreadySent) return;

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
			await prisma.notification.create({
				data: {
					title: `Invoice ${invoice.invoiceNumber} cancellation Sent`,
					description: `Invoice cancellation for ${invoice.invoiceNumber} Sent successfuly to ${invoice.client.email}`,
					organizationId: organizationId,
					category: "invoice",
					type: "success",
					link: `/invoices/${invoice.id}`,
				},
			});

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
		await prisma.notification.create({
			data: {
				title: `Invoice cancellation for ${invoice.invoiceNumber} failed to send`,
				description: `Error - Invoice cancellation for ${invoice.invoiceNumber} failed to send to ${invoice.client.email}`,
				organizationId: organizationId,
				category: "invoice",
				type: "error",
				link: `/invoices/${invoice.id}`,
			},
		});

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
