import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const api = "https://api.paystack.co/transaction/initialize";
const channels = [
	"card",
	"bank",
	"ussd",
	"qr",
	"mobile_money",
	"bank_transfer",
];
// const callback = "http://localhost/invoice/status/";
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
					},
				},
				organization: {
					select: {
						paymentGateways: {
							where: {
								provider: "Paystack",
							},
						},
					},
				},
			},
		});
		if (invoice) {
			const is_live = invoice.organization.paymentGateways[0]?.is_live;
			const gatewayId = invoice.organization.paymentGateways[0]?.id;
			const liveSecretKey =
				invoice.organization.paymentGateways[0]?.live_secret_key;
			if (is_live) {
				const paystackRes = await fetch(api, {
					method: "POST",
					body: JSON.stringify({
						email: invoice?.client.email,
						amount: Number(invoice?.total),
						channels,
					}),
					headers: {
						Authorization: `Bearer ${liveSecretKey}`,
						"Content-Type": "application/json",
					},
				});
				const res = await paystackRes.json();
				if (res?.status) {
					const payment = await prisma.payment.create({
						data: {
							invoiceId: invoice.id,
							gatewayId,
							orgId: invoice.organizationId,
							metadata: res?.data,
							amount: invoice.total,
						},
					});

					return NextResponse.json(
						{
							access_code: res?.data?.access_code || null,
							payment,
							message: res?.message,
							status: res?.status,
						},
						{
							status: 201,
							statusText: "Transaction initialized",
						},
					);
				} else {
					return NextResponse.json(
						{
							access_code: res?.data?.access_code || null,
							payment: null,
							message: res?.message,
							status: res?.status,
						},
						{
							status: 400,
							statusText: "Transaction failed to initialise",
						},
					);
				}
			} else if (!is_live) {
				const testSecretKey =
					invoice.organization.paymentGateways[0]?.test_secret_key;
				const paystackRes = await fetch(api, {
					method: "POST",
					body: JSON.stringify({
						email: invoice?.client.email,
						amount: invoice?.total,
						channels,
						// callback_url: callback + invoice.id,
					}),
					headers: {
						Authorization: `Bearer ${testSecretKey}`,
						"Content-Type": "application/json",
					},
				});
				const res = await paystackRes.json();
				if (res?.status) {
					const payment = await prisma.payment.create({
						data: {
							invoiceId: invoice.id,
							gatewayId,
							orgId: invoice.organizationId,
							metadata: res?.data,
							amount: invoice.total,
						},
					});

					return NextResponse.json(
						{
							access_code: res?.data?.access_code || null,
							payment,
							message: res?.message,
							status: res?.status,
						},
						{
							status: 201,
							statusText: "Transaction initialized",
						},
					);
				} else {
					return NextResponse.json(
						{
							access_code: res?.data?.access_code || null,
							payment: null,
							message: res?.message,
							status: res?.status,
						},
						{
							status: 400,
							statusText: "Transaction failed to initialise",
						},
					);
				}
			}
		} else {
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
