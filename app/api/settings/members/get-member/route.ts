import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const searchParams = request.nextUrl.searchParams;
	const id = String(searchParams.get("id"));
	const orgId = String(searchParams.get("orgId"));
	const member = await prisma.member.findUnique({
		where: {
			id,
			organizationId: orgId,
		},
		include: {
			user: {
				select: {
					id: true,
					email: true,
				},
			},
		},
	});

	try {
		if (member) {
			return NextResponse.json(member, {
				status: 200,
				statusText: "Request successful",
			});
		} else {
			return NextResponse.json(member, {
				status: 400,
				statusText: "Failed to fetch member",
			});
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {
			status: 500,
			statusText: "Failed to get member",
		});
	}
};
