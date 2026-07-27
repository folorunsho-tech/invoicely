/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { email }: { email: string } = await request.json();
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	try {
		const invitation = await prisma.invitation.update({
			where: {
				id,
			},
			data: {
				status: "accepted",
			},
		});
		const role: any = invitation.role;
		if (invitation && user) {
			const data = await auth.api.addMember({
				body: {
					userId: user.id,
					role, // required
					organizationId: invitation.organizationId,
				},
			});
			return NextResponse.json(
				{ invitation, data },
				{
					status: 200,
					statusText: "Invitation accepted",
				},
			);
		} else {
			return NextResponse.json(
				{ invitation, data: null },
				{
					status: 200,
					statusText: "Error accepting invitation",
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
