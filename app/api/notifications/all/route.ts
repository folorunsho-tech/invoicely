import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/authlibs";

export const GET = async (request: NextRequest) => {
	const data = await getSession();
	const isPermitted = await hasPermission({
		notifications: ["read"],
	});
	if (isPermitted.success) {
		try {
			const notifications = await prisma.notification.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			if (notifications) {
				return NextResponse.json(notifications, {
					status: 200,
					statusText: "Request successful",
				});
			} else {
				return NextResponse.json(notifications, {
					status: 400,
					statusText: "Error getting notifications",
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
			statusText: "You are not allowed to read notification",
		});
	}
};
