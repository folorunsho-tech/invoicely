import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
	const data = await getSession();
	const isPermitted = await hasPermission({
		invoice: ["read"],
	});
	if (isPermitted.success) {
		try {
			const trashed = await prisma.invoice.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					is_deleted: true,
				},
				orderBy: {
					updatedAt: "desc",
				},
				include: {
					_count: {
						select: {
							items: true,
						},
					},
					organization: {
						select: {
							slug: true,
						},
					},
					category: true,
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
			statusText: "You are not allowed to read trashed invoices",
		});
	}
}
