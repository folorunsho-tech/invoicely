import { getSession, hasPermission } from "@/lib/authlibs";
import { sendInvoiceEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
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
					notifications: true,
				},
			});
			const response = await sendInvoiceEmail({
				to: invoice?.client.email,
				invoice,
			});

			if (response.success) {
				await prisma.invoiceNotification.create({
					data: {
						invoiceId,
						orgId: String(data?.session.activeOrganizationId),
						recipientEmail: String(invoice?.client?.email),
						sentAt: new Date(),
					},
				});
				return NextResponse.json(response, {
					status: 200,
					statusText: "invoice sent successfully",
				});
			} else {
				return NextResponse.json(response, {
					statusText: "error sending invoice",
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
			statusText: "You are not allowed to send invoice",
		});
	}
}
