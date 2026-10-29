import { verifyTnx } from "@/lib/paykit";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { queueInvoicePayment, queueInvoiceReciept } from "@/lib/queue";
import { getRedisClient } from "@/lib/redis";
import { createFallbackClient, ProviderName } from "@siyegs/pay-kit";
import { decrypt } from "@/lib/utils";
const client = await getRedisClient();

export async function POST(request: NextRequest) {
	const { reference }: { reference: string } = await request.json();
	const rec = await client?.get(`payment:${reference}`);
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
		const paymentSuccess = await prisma.payment.findUnique({
			where: {
				reference,
				status: "success",
			},
		});
		// console.log({ rec, reference });
		if (paymentSuccess) {
			return NextResponse.json(
				{
					success: true,
					pstatus: "success",
				},
				{
					status: 200,
					statusText: "Payment successful",
				},
			);
		}
		if (rec && !paymentSuccess) {
			const pInfo: {
				reference: string;
				authorizationUrl: string;
				accessCode: string | undefined;
				provider: ProviderName;
				invoiceId: string;
				organizationId: string;
			} | null = JSON.parse(rec);
			const gateways = await prisma.gateway.findMany({
				where: {
					orgId: pInfo?.organizationId,
					isEnabled: true,
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const providers: any[] = gateways.map((gateway) => ({
				provider: gateway.provider,
				secretKey: gateway?.secretKey ? decrypt(gateway?.secretKey) : "",
				webhookSecret: gateway?.webhookSecret
					? decrypt(gateway?.webhookSecret)
					: "",
			}));
			const pay = createFallbackClient({
				providers,
			});

			const invoice = await prisma.invoice.findUnique({
				where: {
					id: pInfo?.invoiceId,
					organizationId: pInfo?.organizationId,
				},
				select: {
					id: true,
					invoiceNumber: true,
					organizationId: true,
					total: true,
				},
			});

			const result = await verifyTnx(pay, reference, pInfo?.provider);
			if (result.status == "success") {
				const payment = await prisma.payment.create({
					data: {
						invoiceId: String(pInfo?.invoiceId),
						reference: result.reference,
						accessCode: pInfo?.accessCode,
						orgId: String(invoice?.organizationId),
						amount: String(invoice?.total),
						provider: String(pInfo?.provider),
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
							pstatus: result.status,
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
						pstatus: result.status,
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
