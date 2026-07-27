/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus, PaymentType } from "@/generated/prisma/enums";
import { queueInvoiceReciept } from "@/lib/queue";

export async function GET(request: NextRequest) {
	const data = await getSession();
	const isPermitted = await hasPermission({
		payment: ["read"],
	});
	if (isPermitted.success) {
		try {
			const payments = await prisma.payment.findMany({
				where: {
					orgId: String(data?.session.activeOrganizationId),
					is_deleted: false,
				},

				orderBy: {
					updatedAt: "desc",
				},
				include: {
					gateway: {
						select: {
							provider: true,
						},
					},
					organization: {
						select: {
							slug: true,
						},
					},
					invoice: {
						include: {
							client: true,
						},
					},
				},
			});
			if (payments) {
				return NextResponse.json(payments, {
					status: 200,
					statusText: "Request successful",
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
			statusText: "You are not allowed to read payments",
		});
	}
}
export async function POST(request: NextRequest) {
	const {
		type,
		amount,
		paid_at,
		provider_transaction_id,
		metadata,
		channel,
		status,
		currency,
		orgId,
		invoiceId,
	}: {
		type: PaymentType;
		amount: number;
		paid_at: Date | string;
		provider_transaction_id: string;
		metadata: any;
		invoiceId: string;
		channel: string;
		status: PaymentStatus;
		currency: string;
		orgId: string;
	} = await request.json();
	const isPermitted = await hasPermission({
		payment: ["create"],
	});
	if (isPermitted.success) {
		const isPaymentExist = await prisma.payment.findFirst({
			where: {
				invoiceId,
			},
		});
		if (!isPaymentExist) {
			try {
				const gateway = await prisma.paymentGateway.findFirst({
					where: {
						provider: "Manual",
						organizationId: orgId,
					},
				});
				const payment = await prisma.payment.create({
					data: {
						orgId,
						type,
						amount,
						currency: currency || "NGN",
						paid_at: new Date(paid_at),
						provider_transaction_id,
						metadata,
						gatewayId: gateway?.id || "",
						invoiceId,
						channel,
						status,
						receipts: {
							create: { invoiceId, orgId },
						},
					},
					include: {
						gateway: {
							select: {
								provider: true,
							},
						},
						invoice: {
							include: {
								client: true,
							},
						},
						receipts: true,
					},
				});
				const invPiad = await prisma.invoice.update({
					where: {
						id: payment.invoiceId,
						organizationId: payment.orgId,
					},
					data: {
						status: "PAID",
						paidAt: new Date(paid_at),
					},
				});
				const receipt = payment.receipts[0];
				if (invPiad) {
					await queueInvoiceReciept(payment.orgId, receipt.id);
					return NextResponse.json(payment, {
						status: 201,
						statusText: "payment added successfuly",
					});
				} else {
					return NextResponse.json(null, {
						statusText: "error adding payment",
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
			return NextResponse.json(null, {
				status: 400,
				statusText: "Payment already exist for this invoice",
			});
		}
	} else {
		return NextResponse.json(isPermitted.error, {
			status: 403,
			statusText: "You are not allowed to add payment",
		});
	}
}
export async function DELETE(request: NextRequest) {
	const body = await request.json();
	const data = await getSession();
	const toDelete = body.map((id: { id: string }) => id.id);

	const isPermitted = await hasPermission({
		payment: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.payment.deleteMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id: {
						in: toDelete,
					},
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: deleted.count + " payments deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting payments",
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
			statusText: "You are not allowed to delete payments",
		});
	}
}
