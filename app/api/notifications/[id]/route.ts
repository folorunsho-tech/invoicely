import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/authlibs";

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		notifications: ["update"],
	});
	if (isPermitted.success) {
		try {
			const notification = await prisma.notification.update({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id,
				},
				data: {
					isRead: true,
				},
			});
			if (notification) {
				return NextResponse.json(notification, {
					status: 200,
					statusText: "Notification marked as read",
				});
			} else {
				return NextResponse.json(notification, {
					status: 400,
					statusText: "Error marking notification as read",
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
			statusText: "You are not allowed to update notification",
		});
	}
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		notifications: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const notification = await prisma.notification.delete({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id,
				},
			});
			if (notification) {
				return NextResponse.json(notification, {
					status: 200,
					statusText: "Notification deleted",
				});
			} else {
				return NextResponse.json(notification, {
					status: 400,
					statusText: "Error deleting notification",
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
			statusText: "You are not allowed to delete notification",
		});
	}
};
