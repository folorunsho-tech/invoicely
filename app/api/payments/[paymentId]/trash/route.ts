import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ paymentId: string }> },
) {
	const { paymentId } = await params;
	const data = await getSession();
	const { is_deleted }: { is_deleted: boolean } = await request.json();

	const isPermitted = await hasPermission({
		payment: ["update"],
	});
	if (isPermitted.success) {
		try {
			const trashed = await prisma.payment.update({
				where: {
					id: paymentId,
					orgId: String(data?.session.activeOrganizationId),
				},
				data: {
					is_deleted,
				},
			});
			if (trashed) {
				return NextResponse.json(trashed, {
					status: 200,
					statusText: "payment trashed successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error trashing payment",
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
			statusText: "You are not allowed to trash payment",
		});
	}
}
