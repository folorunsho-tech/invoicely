import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ invoiceId: string }> },
) {
	const { invoiceId } = await params;
	const data = await getSession();

	const isPermitted = await hasPermission({
		invoice: ["update"],
	});
	if (isPermitted.success) {
		try {
			const trashed = await prisma.invoice.update({
				where: {
					id: invoiceId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: {
					is_deleted: true,
				},
			});
			if (trashed) {
				return NextResponse.json(trashed, {
					status: 200,
					statusText: "invoice trashed successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error trashing invoice",
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
			statusText: "You are not allowed to trash invoice",
		});
	}
}
