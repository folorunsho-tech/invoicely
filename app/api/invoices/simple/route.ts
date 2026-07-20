import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
	const data = await getSession();
	const isPermitted = await hasPermission({
		invoice: ["read"],
	});
	if (isPermitted.success) {
		try {
			const invoices = await prisma.invoice.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					is_deleted: false,
				},
				orderBy: {
					updatedAt: "desc",
				},
				include: {
					items: true,
					client: true,
					category: true,
					organization: {
						select: {
							slug: true,
							currencySymbol: true,
						},
					},
				},
			});
			if (invoices) {
				return NextResponse.json(invoices, {
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
			statusText: "You are not allowed to read invoices",
		});
	}
}
