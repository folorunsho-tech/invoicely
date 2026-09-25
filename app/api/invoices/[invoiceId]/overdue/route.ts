import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { queueInvoiceOverdue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> },
) {
	const { invoiceId } = await params;
	const data = await getSession();

	const isPermitted = await hasPermission({
		invoice: ["update"],
	});
	if (isPermitted.success) {
		const inv = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
			select: {
				status: true,
			},
		});
		if (
			inv?.status == "PAID" ||
			inv?.status == "DRAFT" ||
			inv?.status == "CANCELLED"
		) {
			return NextResponse.json(null, {
				status: 400,
				statusText: "Can not mark paid or cancelled invoice as overdued",
			});
		}
		try {
			const invoice = await prisma.invoice.update({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: {
					status: "OVERDUE",
				},
				include: {
					client: true,
					organization: true,
					items: true,
				},
			});
			await queueInvoiceOverdue({
				organizationId: String(data?.session.activeOrganizationId),
				invoiceId,
				delay: 86400000,
			});

			if (invoice) {
				return NextResponse.json(invoice, {
					status: 200,
					statusText: "invoice marked as overdue successfully",
				});
			} else {
				return NextResponse.json(
					{ success: false, error: "Error marking invoice as overdue" },
					{
						status: 400,
						statusText: "Error marking invoice as overdue",
					},
				);
			}
		} catch (error) {
			console.log(error);
			return NextResponse.json(error, {
				status: 500,
				statusText: "Error marking invoice as overdue",
			});
		}
	} else {
		return NextResponse.json(isPermitted.error, {
			status: 403,
			statusText: "You are not allowed to mark invoice as overdue",
		});
	}
}
