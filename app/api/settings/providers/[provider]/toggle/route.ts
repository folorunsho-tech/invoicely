import { GatewayProvider } from "@/generated/prisma/enums";
import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) {
	const { provider } = await params;

	const { isActive } = await request.json();
	const data = await getSession();
	const orgId = String(data?.session.activeOrganizationId);
	const isPermitted = await hasPermission({
		settings: ["update"],
	});
	if (isPermitted.success) {
		try {
			const gateway = await prisma.gateway.update({
				where: {
					orgId_provider: {
						orgId: orgId,
						provider: provider as GatewayProvider,
					},
				},
				data: {
					isActive,
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
