import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
	const body = await request.json();
	const data = await getSession();
	const toRestore = body.map((id: { id: string }) => id.id);
	const isPermitted = await hasPermission({
		client: ["update"],
	});
	if (isPermitted.success) {
		try {
			const trashed = await prisma.client.updateMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id: {
						in: toRestore,
					},
				},
				data: {
					is_deleted: false,
				},
			});
			if (trashed) {
				return NextResponse.json(trashed, {
					status: 200,
					statusText: trashed.count + " clients restore from successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error restoring clients",
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
			statusText: "You are not allowed to restore clients",
		});
	}
}
