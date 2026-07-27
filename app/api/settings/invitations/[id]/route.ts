import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const found = await prisma.invitation.findUnique({
			where: {
				id,
			},
			include: {
				user: true,
				organization: true,
			},
		});
		if (found) {
			return NextResponse.json(found, {
				status: 200,
				statusText: "Request successful",
			});
		} else if (!found) {
			return NextResponse.json(null, {
				status: 404,
				statusText: "invoice not found",
			});
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
