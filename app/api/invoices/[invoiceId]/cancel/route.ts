import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { queueInvoiceCancellation } from "@/lib/queue";
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
		try {
			const invoice = await prisma.invoice.update({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: {
					status: "CANCELLED",
					cancelledAt: new Date(),
				},
				include: {
					client: true,
					organization: true,
					items: true,
					notifications: true,
				},
			});
			await queueInvoiceCancellation(
				String(data?.session.activeOrganizationId),
				invoiceId,
			);

			if (invoice) {
				return NextResponse.json(invoice, {
					status: 200,
					statusText: "invoice cancelled successfully",
				});
			} else {
				return NextResponse.json(
					{ success: false, error: "error cancelling invoice" },
					{
						status: 400,
						statusText: "error cancelling invoice",
					},
				);
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
			statusText: "You are not allowed to cancel invoice",
		});
	}
}
