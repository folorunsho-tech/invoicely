import { GatewayProvider } from "@/generated/prisma/enums";
import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) {
	const { provider } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		settings: ["read"],
	});
	if (isPermitted.success) {
		try {
			const providers = await prisma.gateway.findUnique({
				where: {
					orgId_provider: {
						orgId: String(data?.session.activeOrganizationId),
						provider: provider as GatewayProvider,
					},
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
			statusText: "You are not allowed to read provider",
		});
	}
}
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) {
	const { provider } = await params;

	const { secretKey, webhookSecret, publicKey } = await request.json();
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
					secretKey: encrypt(secretKey),
					webhookSecret: webhookSecret ? encrypt(webhookSecret) : null,
					publicKey: encrypt(publicKey),
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
