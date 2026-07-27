import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/authlibs";

export async function GET(request: NextRequest) {
	const data = await getSession();
	if (data?.session) {
		try {
			const invitations = await prisma.invitation.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
				},

				orderBy: {
					createdAt: "desc",
				},
				include: {
					organization: {
						select: {
							slug: true,
						},
					},
					user: true,
				},
			});
			if (invitations) {
				return NextResponse.json(invitations, {
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
		return NextResponse.json(
			{ error: "Unauthorized" },
			{
				status: 403,
				statusText: "You are not allowed to read payments",
			},
		);
	}
}
