import { verifyTnx } from "@/lib/paykit";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { reference, tnxId }: { reference: string; tnxId: string } =
		await request.json();
	const payment = await prisma.payment.findUnique({
		where: {
			reference,
			OR: [
				{
					provider: {
						not: "manual",
					},
				},
				{
					provider: "mock",
				},
			],
		},
	});
	try {
		if (!payment) {
			return NextResponse.json(
				{ success: false, error: "Invalid transaction reference" },
				{
					status: 404,
					statusText: "Invalid transaction reference",
				},
			);
		}
		if (!reference) {
			return NextResponse.json(
				{ success: false, error: "No transaction reference provided" },
				{
					status: 400,
					statusText: "No transaction refeence provided",
				},
			);
		}
		if (payment) {
			const result = await verifyTnx(reference, payment.provider);

			if (result.status === "success") {
				const payment = await prisma.payment.update({
					where: {
						reference,
					},
					data: {
						channel: result.channel,
						status: result.status,
						provider_transaction_id: tnxId,
						paid_at: result.paidAt ? new Date(result.paidAt) : new Date(),
						currency: result.currency,
					},
				});
				const invoice = await prisma.invoice.update({
					where: {
						id: payment.invoiceId,
					},
					data: {
						status: "PAID",
						paidAt: result.paidAt ? new Date(result.paidAt) : new Date(),
					},
				});
				return NextResponse.json(
					{
						success: true,
						error: null,
						payment,
						invoice,
					},
					{
						status: 200,
						statusText: "Payment successful",
					},
				);
			} else if (result.status === "abandoned" || result.status === "failed") {
				const payment = await prisma.payment.update({
					where: {
						reference,
					},
					data: {
						channel: result.channel,
						status: result.status,
						provider_transaction_id: tnxId,
						paid_at: result.paidAt ? new Date(result.paidAt) : new Date(),
						currency: result.currency,
					},
				});
				return NextResponse.json(
					{
						success: false,
						error: `Payment ${result.status}`,
						payment,
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
