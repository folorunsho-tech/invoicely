import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { queueInvoiceResend } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
			const invoice = await prisma.invoice.findUnique({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				include: {
					client: true,
					organization: true,
					items: true,
				},
			});
			if (invoice) {
				await queueInvoiceResend(
					String(data?.session.activeOrganizationId),
					invoice.id,
				);
				return NextResponse.json(
					{ success: true, message: "invoice queued for sending" },
					{
						status: 200,
						statusText: "invoice sent successfully",
					},
				);
			} else {
				return NextResponse.json(
					{ success: false, message: "error queueing invoice for sending" },
					{
						statusText: "error sending invoice",
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
			statusText: "You are not allowed to send invoice",
		});
	}
}
