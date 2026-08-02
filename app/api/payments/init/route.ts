import { initTnx } from "@/lib/paykit";
import { prisma } from "@/lib/prisma";
import { queueInvoicePayment, queueInvoiceReciept } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { invoiceId }: { invoiceId: string } = await request.json();
	try {
		const invoice = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
			select: {
				id: true,
				invoiceNumber: true,
				organizationId: true,
				total: true,
				client: {
					select: {
						email: true,
						name: true,
						address: true,
						country: true,
						state: true,
					},
				},
				currency: true,
				status: true,
			},
		});
		if (invoice && invoice?.status !== "PAID") {
			const res = await initTnx({
				amount: Number(invoice.total),
				email: invoice.client.email,
				invoiceId: invoice.id,
				currency: invoice.currency,
			});
			if (res) {
				const payment = await prisma.payment.create({
					data: {
						invoiceId,
						reference: res.reference,
						accessCode: res.accessCode,
						orgId: invoice.organizationId,
						amount: invoice.total,
						provider: res.provider,
					},
				});
				const receipt = await prisma.invoiceReciept.create({
					data: {
						invoiceId,
						paymentId: payment.id,
						orgId: payment.orgId,
					},
				});
				await queueInvoicePayment(payment.orgId, payment.id);
				await queueInvoiceReciept(receipt.orgId, receipt.id);
				return NextResponse.json(
					{
						success: true,
						error: null,
						payment,
						redirectUrl: res.authorizationUrl,
					},
					{
						status: 200,
						statusText: "Invoice has been paid",
					},
				);
			}
		} else if (invoice?.status == "PAID") {
			return NextResponse.json(
				{ success: true, error: null },
				{
					status: 200,
					statusText: "Invoice has been paid",
				},
			);
		} else if (!invoice) {
			return NextResponse.json(
				{ success: false, error: "Invoice does not exist" },
				{
					status: 404,
					statusText: "Invoice does not exist",
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
}
