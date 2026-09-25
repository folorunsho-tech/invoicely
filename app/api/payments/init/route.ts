import { initTnx } from "@/lib/paykit";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/redis";

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
		if (invoice?.status == "PAID") {
			return NextResponse.json(
				{ success: true, error: null },
				{
					status: 200,
					statusText: "Invoice has been paid",
				},
			);
		} else if (invoice?.status == "PENDING") {
			const res = await initTnx({
				amount: Number(invoice.total),
				email: invoice.client.email,
				invoiceId: invoice.id,
				currency: invoice.currency,
			});
			if (res.authorizationUrl && res.reference) {
				await client.set(
					`payment:${res.reference}`,
					JSON.stringify({
						...res,
						invoiceId: invoice.id,
						organizationId: invoice.organizationId,
						accessCode: res.accessCode,
					}),
					{
						expiration: {
							value: 60 * 60 * 24,
							type: "EX",
						}, // 1 day
					},
				);
				return NextResponse.json(
					{
						success: true,
						error: null,
						redirectUrl: res.authorizationUrl,
					},
					{
						status: 200,
						statusText: "Invoice has payment is initialized",
					},
				);
			} else {
				console.log("Payment initialization failed: ", res);
				return NextResponse.json(
					{
						success: false,
						error: "Payment initialization failed",
					},
					{
						status: 400,
						statusText: "Payment initialization failed",
					},
				);
			}
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
