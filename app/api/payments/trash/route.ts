import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
	const data = await getSession();
	const isPermitted = await hasPermission({
		payment: ["read"],
	});
	if (isPermitted.success) {
		try {
			const trashed = await prisma.payment.findMany({
				where: {
					orgId: String(data?.session.activeOrganizationId),
					is_deleted: true,
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

			if (trashed) {
				return NextResponse.json(trashed, {
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
			statusText: "You are not allowed to read trashed payments",
		});
	}
}
