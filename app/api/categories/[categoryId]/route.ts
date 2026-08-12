import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ categoryId: string }> },
) {
	const { categoryId } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		category: ["read"],
	});
	if (isPermitted.success) {
		try {
			const found = await prisma.category.findUnique({
				where: {
					id: categoryId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				include: {
					invoices: {
						include: {
							_count: {
								select: {
									items: true,
								},
							},
						},
					},
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
					statusText: "category not found",
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
			statusText: "You are not allowed to read category",
		});
	}
}
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ categoryId: string }> },
) {
	const { categoryId } = await params;
	const data = await getSession();
	const {
		name,
		slug,
		description,
	}: { name: string; slug: string; description?: string } =
		await request.json();

	const isPermitted = await hasPermission({
		category: ["update"],
	});
	if (isPermitted.success) {
		try {
			const updated = await prisma.category.update({
				where: {
					id: categoryId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: { name, slug, description },
			});
			if (updated) {
				return NextResponse.json(updated, {
					status: 200,
					statusText: "category updated successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error adding category",
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
			statusText: "You are not allowed to update category",
		});
	}
}
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ categoryId: string }> },
) {
	const { categoryId } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		category: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.category.delete({
				where: {
					id: categoryId,
					organizationId: String(data?.session.activeOrganizationId),
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: "category deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting category",
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
			statusText: "You are not allowed to delete category",
		});
	}
}
