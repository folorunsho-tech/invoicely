import { createFallbackClient } from "@siyegs/pay-kit";
import { initTnx } from "@/lib/paykit";
import { prisma } from "@/lib/prisma";
import { queueInvoicePayment, queueInvoiceReciept } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/utils";

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
		const providers = await prisma.gateway.findMany({
			where: {
				orgId: String(invoice?.organizationId),
				provider: {
					not: "manual",
				},
			},
			select: {
				provider: true,
				secretKey: true,
				webhookSecret: true,
				id: true,
			},
		});
		const flutterwave = providers.find(
			(provider) => provider.provider === "flutterwave",
		);
		const paystack = providers.find(
			(provider) => provider.provider === "paystack",
		);
		const pay = createFallbackClient({
			providers: [
				{
					provider: "flutterwave",
					secretKey: decrypt(flutterwave?.secretKey || ""),
					webhookSecret: decrypt(flutterwave?.webhookSecret || ""),
				},
				{ provider: "paystack", secretKey: decrypt(paystack?.secretKey || "") },
			],
		});
		if (invoice && invoice?.status !== "PAID") {
			const res = await initTnx({
				amount: Number(invoice.total),
				email: invoice.client.email,
				invoiceId: invoice.id,
				currency: invoice.currency,
				pay,
			});
			if (res) {
				const provider = providers.find((p) => p.provider === res.provider);
				const payment = await prisma.payment.create({
					data: {
						invoiceId,
						reference: res.reference,
						accessCode: res.accessCode,
						orgId: invoice.organizationId,
						amount: invoice.total,
						gatwayId: provider?.id || "",
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
