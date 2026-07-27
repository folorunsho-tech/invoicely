import { hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { queueInvoiceReciept } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
	request: NextRequest,
	{ params }: { params: Promise<{ paymentId: string }> },
) => {
	const { paymentId } = await params;

	const isPermitted = await hasPermission({
		payment: ["read"],
	});
	if (isPermitted.success) {
		try {
			const receipt = await prisma.invoiceReciept.findFirst({
				where: {
					paymentId,
				},
			});
			if (receipt) {
				await queueInvoiceReciept(receipt?.orgId, receipt?.id);
				return NextResponse.json(receipt, {
					status: 200,
					statusText: "Receipt has been sent",
				});
			} else {
				return NextResponse.json(receipt, {
					status: 400,
					statusText: "Invoice has yet to be paid",
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
			statusText: "You are not allowed to send payment receipt",
		});
	}
};
