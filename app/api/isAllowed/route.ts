import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const isAllowed = await prisma.organization.findFirst({
			select: {
				id: true,
				name: true,
			},
		});
		if (!isAllowed) {
			return NextResponse.json(
				{ isAllowed: true },
				{
					status: 200,
					statusText: "Signup Allowed",
				},
			);
		} else {
			return NextResponse.json(
				{ isAllowed: false },
				{
					status: 400,
					statusText: "Signup not allowed",
				},
			);
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
