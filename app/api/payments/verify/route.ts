import { verifyTnx } from "@/lib/paykit";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { queueInvoicePayment, queueInvoiceReciept } from "@/lib/queue";
import { getRedisClient } from "@/lib/redis";
const client = await getRedisClient();

export async function POST(request: NextRequest) {
	const { reference }: { reference: string } = await request.json();
	const rec = await client.get(`payment:${reference}`);

	try {
		if (!reference) {
			return NextResponse.json(
				{ success: false, error: "No transaction reference provided" },
				{
					status: 400,
					statusText: "No transaction reference provided",
				},
			);
		}
		const paymentExists = await prisma.payment.findUnique({
			where: {
				reference,
				status: "success",
			},
		});
		if (!paymentExists) {
			return NextResponse.json(
				{
					success: true,
					status: "success",
				},
				{
					status: 200,
					statusText: "Payment successful",
				},
			);
		}
		if (rec && paymentExists) {
			const { organizationId, invoiceId, provider, accessCode } =
				JSON.parse(rec);

			const invoice = await prisma.invoice.findUnique({
				where: {
					id: invoiceId,
					organizationId: organizationId,
				},
				select: {
					id: true,
					invoiceNumber: true,
					organizationId: true,
					total: true,
				},
			});

			const result = await verifyTnx(reference, provider);
			if (result.status == "success") {
				const payment = await prisma.payment.upsert({
					where: {
						reference: result.reference,
					},
					update: {
						invoiceId,
						channel: result.channel,
						accessCode,
						orgId: String(invoice?.organizationId),
						amount: String(invoice?.total),
						provider,
						paid_at: result.paidAt ? new Date(result.paidAt) : new Date(),
						status: result.status,
					},
					create: {
						invoiceId,
						reference: result.reference,
						accessCode,
						orgId: String(invoice?.organizationId),
						amount: String(invoice?.total),
						provider,
						paid_at: result.paidAt ? new Date(result.paidAt) : new Date(),
						status: result.status,
						channel: result.channel,
					},
				});

				if (payment.status == "success") {
					await prisma.invoice.update({
						where: {
							id: payment.invoiceId,
						},
						data: {
							status: "PAID",
							paidAt: payment?.paid_at
								? new Date(payment?.paid_at)
								: new Date(),
						},
					});
					const receipt = await prisma.invoiceReciept.create({
						data: {
							invoiceId: payment.invoiceId,
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
							status: result.status,
						},
						{
							status: 200,
							statusText: "Payment successful",
						},
					);
				}
			} else if (result.status == "abandoned" || result.status == "failed") {
				return NextResponse.json(
					{
						success: false,
						error: `Payment ${result.status}`,
						status: result.status,
					},
					{
						status: 400,
						statusText: `Payment ${result.status}`,
					},
				);
			}
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {
			status: 500,
			statusText: "Internal Server Error at payment verify",
		});
	}
}
