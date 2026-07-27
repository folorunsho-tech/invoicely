import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		notifications: ["update"],
	});
	if (isPermitted.success) {
		try {
			const updated = await prisma.notification.update({
				where: {
					id,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: {
					status: "read",
				},
			});
			if (updated) {
				return NextResponse.json(updated, {
					status: 200,
					statusText: "Notification marked as read",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error marking notification",
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
}
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		notifications: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.notification.delete({
				where: {
					id,
					organizationId: String(data?.session.activeOrganizationId),
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: "Notification deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting notification",
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
}
