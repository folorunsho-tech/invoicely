import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { isEnabled } = await request.json();
	const data = await getSession();
	const orgId = String(data?.session.activeOrganizationId);
	const isPermitted = await hasPermission({
		settings: ["update"],
	});
	if (isPermitted.success) {
		try {
			const gateway = await prisma.gateway.update({
				where: {
					id,
					orgId,
				},
				data: {
					isEnabled,
				},
				include: {
					organization: true,
				},
			});
			if (gateway) {
				return NextResponse.json(gateway, {
					status: 201,
					statusText: "provider updated successfuly",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error updating provider",
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
			statusText: "You are not allowed to update provider",
		});
	}
}
