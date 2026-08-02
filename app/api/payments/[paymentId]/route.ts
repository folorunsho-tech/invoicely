import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ paymentId: string }> },
) {
	const { paymentId } = await params;
	const data = await getSession();

	const isPermitted = await hasPermission({
		payment: ["read"],
	});
	if (isPermitted.success) {
		try {
			const found = await prisma.payment.findUnique({
				where: {
					id: paymentId,
					orgId: String(data?.session.activeOrganizationId),
				},
				include: {
					invoice: {
						include: {
							client: true,
							items: true,
							organization: {
								select: {
									currencySymbol: true,
								},
							},
						},
					},
					organization: {
						select: { slug: true },
					},
					receipts: true,
				},
			});
			if (found) {
				return NextResponse.json(found, {
					status: 200,
					statusText: "Request successful",
				});
			} else if (!found) {
				return NextResponse.json(null, {
					status: 404,
					statusText: "payment not found",
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
			statusText: "You are not allowed to read payment",
		});
	}
}
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ paymentId: string }> },
) {
	const { paymentId } = await params;
	const data = await getSession();
	const { status, paid_at, provider_transaction_id, channel, metadata } =
		await request.json();

	const isPermitted = await hasPermission({
		payment: ["update"],
	});
	if (isPermitted.success) {
		try {
			const updated = await prisma.payment.update({
				where: {
					id: paymentId,
					orgId: String(data?.session.activeOrganizationId),
				},
				data: {
					status,
					paid_at: new Date(paid_at),
					provider_transaction_id,
					channel,
					metadata: JSON.stringify(metadata),
					invoice: {
						update: {
							paidAt: new Date(paid_at),
						},
					},
				},
				include: {
					invoice: {
						include: {
							client: true,
							items: true,
						},
					},
					organization: {
						select: { slug: true },
					},
				},
			});
			if (updated) {
				return NextResponse.json(updated, {
					status: 200,
					statusText: "payment updated successfully",
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
			statusText: "You are not allowed to update payment",
		});
	}
}
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ paymentId: string }> },
) {
	const { paymentId } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		payment: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.payment.delete({
				where: {
					id: paymentId,
					orgId: String(data?.session.activeOrganizationId),
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: "payment deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting payment",
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
			statusText: "You are not allowed to delete payment",
		});
	}
}
