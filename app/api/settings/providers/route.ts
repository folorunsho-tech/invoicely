import { GatewayProvider } from "@/generated/prisma/enums";
import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const data = await getSession();
	const isPermitted = await hasPermission({
		settings: ["read"],
	});
	if (isPermitted.success) {
		try {
			const providers = await prisma.gateway.findMany({
				where: {
					orgId: String(data?.session.activeOrganizationId),
				},

				orderBy: {
					updatedAt: "desc",
				},
				include: {
					organization: {
						select: {
							slug: true,
						},
					},
				},
			});
			if (providers) {
				return NextResponse.json(providers, {
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
			statusText: "You are not allowed to read providers",
		});
	}
}
export async function POST(request: NextRequest) {
	const {
		provider,
		rank,
	}: {
		provider: GatewayProvider;
		rank: number;
	} = await request.json();
	const data = await getSession();
	const orgId = String(data?.session.activeOrganizationId);
	const isPermitted = await hasPermission({
		settings: ["create"],
	});
	if (isPermitted.success) {
		try {
			const gateway = await prisma.gateway.create({
				data: {
					orgId: orgId,
					provider,
					rank,
				},
				include: {
					organization: true,
				},
			});
			if (gateway) {
				return NextResponse.json(gateway, {
					status: 201,
					statusText: "provider added successfuly",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error adding provider",
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
			statusText: "You are not allowed to add provider",
		});
	}
}
