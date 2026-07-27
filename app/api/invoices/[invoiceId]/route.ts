import { InvoiceStatus } from "@/generated/prisma/client";
import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
	queueInvoiceUpdateSend,
	removeJobsFromInvoiceQueue,
} from "@/lib/queue";
// import { generateReminders } from "@/lib/generateReminders";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> },
) {
	const { invoiceId } = await params;
	const data = await getSession();

	const isPermitted = await hasPermission({
		invoice: ["read"],
	});
	if (isPermitted.success) {
		try {
			const found = await prisma.invoice.findUnique({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				include: {
					items: true,
					client: true,
					payments: {
						include: {
							gateway: true,
							organization: true,
						},
					},
					organization: true,

					receipts: true,
				},
			});
			if (found) {
				return NextResponse.json(found, {
					status: 200,
					statusText: "Request successful",
				});
			} else if (!found) {
				return NextResponse.json(null, {
					status: 404,
					statusText: "invoice not found",
				});
			}
		} catch (error) {
			console.log(error);
			return NextResponse.json(error, {
				status: 500,
				statusText: "Internal Server Error",
			});
		}
	} else {
		return NextResponse.json(isPermitted.error, {
			status: 403,
			statusText: "You are not allowed to read invoice",
		});
	}
}
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> },
) {
	const { invoiceId } = await params;
	const data = await getSession();
	const {
		issued_date,
		due_date,
		project_subject,
		categoryId,
		items,
		toDelete,
		status,
		sendNotification,
	}: {
		issued_date: Date;
		due_date: Date;
		project_subject: string;
		categoryId: string | null;
		items: {
			id: string;
			name: string;
			rate: number;
			quantity: number;
			total: number;
		}[];
		toDelete: { id: string }[];
		status: InvoiceStatus;
		sendNotification?: boolean;
	} = await request.json();

	const isPermitted = await hasPermission({
		invoice: ["update"],
	});

	if (isPermitted.success) {
		const toUpdate = items.map((it) => ({
			where: { id: it.id },
			update: {
				name: it.name,
				rate: Number(it.rate),
				quantity: Number(it.quantity),
				total: Number(it.total),
			},
			create: {
				id: it.id,
				name: it.name,
				rate: Number(it.rate),
				quantity: Number(it.quantity),
				total: Number(it.total),
			},
		}));

		try {
			const total = items.reduce((prev, curr) => {
				return prev + curr.total;
			}, 0);
			const updated = await prisma.invoice.update({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: {
					issued_date,
					due_date,
					project_subject,
					categoryId,
					status,
					total,
					items: {
						deleteMany: toDelete,
						upsert: toUpdate,
					},
				},
			});

			if (sendNotification) {
				await removeJobsFromInvoiceQueue(invoiceId);
				await queueInvoiceUpdateSend(
					String(data?.session.activeOrganizationId),
					invoiceId,
				);
				// const reminders = generateReminders(
				// 	updated.due_date,
				// 	invoiceId,
				// 	String(data?.session.activeOrganizationId),
				// );
				// await queueInvoiceReminders(reminders);
			}
			if (updated) {
				return NextResponse.json(updated, {
					status: 200,
					statusText: "invoice updated successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error updating invoice",
				});
			}
		} catch (error) {
			console.log(error);
			return NextResponse.json(error, {
				status: 500,
				statusText: "Internal Server Error",
			});
		}
	} else {
		return NextResponse.json(isPermitted.error, {
			status: 403,
			statusText: "You are not allowed to update invoice",
		});
	}
}
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> },
) {
	const { invoiceId } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		invoice: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.invoice.delete({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: "invoice deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting invoice",
				});
			}
		} catch (error) {
			console.log(error);
			return NextResponse.json(error, {
				status: 500,
				statusText: "Internal Server Error",
			});
		}
	} else {
		return NextResponse.json(isPermitted.error, {
			status: 403,
			statusText: "You are not allowed to delete invoice",
		});
	}
}
