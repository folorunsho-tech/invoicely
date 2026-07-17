/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { PaymentType } from "@/generated/prisma/enums";

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
		gatewayId,
		invoiceId,
	}: {
		type: PaymentType;
		amount: number;
		paid_at: Date | string;
		provider_transaction_id: string;
		metadata: any;
		gatewayId: string;
		invoiceId: string;
	} = await request.json();
	const data = await getSession();
	const orgId = String(data?.session.activeOrganizationId);
	const isPermitted = await hasPermission({
		payment: ["create"],
	});
	if (isPermitted.success) {
		const org = await auth.api.getFullOrganization({
			query: {
				organizationId: orgId,
			},
			// This endpoint requires session cookies.
			headers: await headers(),
		});
		try {
			const payment = await prisma.payment.create({
				data: {
					orgId,
					type,
					amount,
					currency: org?.currency || "NGN",
					paid_at,
					provider_transaction_id,
					metadata,
					gatewayId,
					invoiceId,
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
				},
			});
			if (payment) {
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
