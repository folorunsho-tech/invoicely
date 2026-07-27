/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const { user, inviteId } = await request.json();
	const invite = await prisma.invitation.findUnique({
		where: {
			id: inviteId,
		},
	});
	const role: any = invite?.role;
	try {
		const data = await auth.api.addMember({
			body: {
				userId: user?.id,
				role, // required
				organizationId: invite?.organizationId,
			},
		});
		if (data) {
			return NextResponse.json(data, {
				status: 200,
				statusText: "User added to organization successfuly",
			});
		} else {
			return NextResponse.json(data, {
				status: 400,
				statusText: "Failed to add user to organization",
			});
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {
			status: 500,
			statusText: "Failed to add user to organization",
		});
	}
};
// export const PATCH = async (request: NextRequest) => {
// 	const { email, inviteId } = await request.json();
// 	const user = await prisma.user.findUnique({
// 		where: { email },
// 	});
// 	const invite = await prisma.invitation.findUnique({
// 		where: {
// 			id: inviteId,
// 		},
// 	});
// 	const role: any = invite?.role;
// 	try {
// 		const data = await auth.api.addMember({
// 			body: {
// 				userId: String(user?.id),
// 				role, // required
// 				organizationId: invite?.organizationId,
// 			},
// 		});
// 		if (data) {
// 			return NextResponse.json(data, {
// 				status: 200,
// 				statusText: "User added to organization successfuly",
// 			});
// 		} else {
// 			return NextResponse.json(data, {
// 				status: 400,
// 				statusText: "Failed to add user to organization",
// 			});
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		return NextResponse.json(error, {
// 			status: 500,
// 			statusText: "Failed to add user to organization",
// 		});
// 	}
// };
