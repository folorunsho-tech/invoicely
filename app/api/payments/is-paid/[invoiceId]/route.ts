import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> },
) {
	const { invoiceId } = await params;
	try {
		const invoice = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
			select: {
				status: true,
			},
		});
		const payment = await prisma.payment.findFirst({
			where: {
				invoiceId,
				status: "Successful",
			},
			include: {
				invoice: {
					include: {
						organization: true,
					},
				},
			},
		});
		const res = {
			status: invoice?.status,
			paid: payment ? true : false,
			payment,
		};

		return NextResponse.json(res);
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
