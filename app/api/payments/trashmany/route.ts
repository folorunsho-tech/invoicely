import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
	const body = await request.json();
	const data = await getSession();
	const toTrash = body.map((id: { id: string }) => id.id);
	const isPermitted = await hasPermission({
		payment: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const trashed = await prisma.payment.updateMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id: {
						in: toTrash,
					},
				},
				data: {
					is_deleted: true,
				},
			});
			if (trashed) {
				return NextResponse.json(trashed, {
					status: 200,
					statusText: trashed.count + "payments trashed successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error trashing payments",
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
			statusText: "You are not allowed to trash payments",
		});
	}
}
