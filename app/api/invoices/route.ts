import { InvoiceStatus } from "@/generated/prisma/enums";
import { getSession, hasPermission } from "@/lib/authlibs";
import { generateReminders } from "@/lib/generateReminders";
import { generateInvoiceNumber } from "@/lib/invoiceNumberGen";
import { prisma } from "@/lib/prisma";
import { queueInvoiceReminders, queueInvoiceSend } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";
export async function GET() {
	const data = await getSession();
	const isPermitted = await hasPermission({
		invoice: ["read"],
	});
	if (isPermitted.success) {
		try {
			const invoices = await prisma.invoice.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					is_deleted: false,
				},
				orderBy: {
					updatedAt: "desc",
				},
				include: {
					_count: {
						select: {
							items: true,
						},
					},
					client: true,

					organization: {
						select: {
							slug: true,
							currencySymbol: true,
						},
					},
					category: true,
				},
			});
			if (invoices) {
				return NextResponse.json(invoices, {
					status: 200,
					statusText: "Request successful",
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
			statusText: "You are not allowed to read invoices",
		});
	}
}
export async function POST(request: NextRequest) {
	const {
		issued_date,
		due_date,
		project_subject,
		items,
		categoryId,
		clientId,
		status,
	}: {
		issued_date: string | Date;
		due_date: string | Date;
		project_subject?: string | null | undefined;
		status?: InvoiceStatus;
		items: {
			id: string;
			name: string;
			rate: number;
			quantity: number;
			total: number;
		}[];
		categoryId?: string | null;
		clientId: string;
	} = await request.json();
	const data = await getSession();
	const isPermitted = await hasPermission({
		invoice: ["create"],
	});
	const organizationId = String(data?.session.activeOrganizationId);
	const number = await generateInvoiceNumber(organizationId);
	const total = items?.reduce((prev, curr) => {
		const iTotal = Number(curr.rate) * curr.quantity;
		return prev + iTotal;
	}, 0);
	if (isPermitted.success) {
		try {
			const invoice = await prisma.invoice.create({
				data: {
					organizationId,
					invoiceNumber: number,
					clientId,
					project_subject,
					issued_date,
					due_date,
					categoryId,
					status,
					items: {
						createMany: { data: items },
					},
					total,
				},
			});
			if (status !== "DRAFT") {
				await queueInvoiceSend(invoice.organizationId, invoice.id);
			}
			if (invoice) {
				return NextResponse.json(invoice, {
					status: 201,
					statusText: "invoice added successfuly",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error adding invoice",
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
			statusText: "You are not allowed to add invoice",
		});
	}
}
export async function DELETE(request: NextRequest) {
	const body: { id: string }[] = await request.json();
	const data = await getSession();
	const toDelete = body.map((id: { id: string }) => id.id);

	const isPermitted = await hasPermission({
		invoice: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.invoice.deleteMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id: {
						in: toDelete,
					},
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: deleted.count + " invoices deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting invoices",
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
			statusText: "You are not allowed to delete invoices",
		});
	}
}
