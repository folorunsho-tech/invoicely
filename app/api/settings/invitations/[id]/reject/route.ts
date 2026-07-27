import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const invitation = await prisma.invitation.update({
			where: {
				id,
			},
			data: {
				status: "rejected",
			},
		});
		if (invitation) {
			return NextResponse.json(
				{ invitation },
				{
					status: 200,
					statusText: "Invitation rejected",
				},
			);
		} else {
			return NextResponse.json(
				{ invitation },
				{
					status: 200,
					statusText: "Error rejecting invitation",
				},
			);
		}
	} catch (error) {
		return NextResponse.json(error, {
			status: 500,
			statusText: "Internal server Error",
		});
	}
}
