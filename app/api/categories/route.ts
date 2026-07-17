import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
	const data = await getSession();
	const isPermitted = await hasPermission({
		category: ["read"],
	});
	if (isPermitted.success) {
		try {
			const categories = await prisma.category.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
				},
				include: {
					organization: {
						select: {
							slug: true,
						},
					},
					_count: {
						select: {
							invoices: true,
						},
					},
				},
			});
			if (categories) {
				return NextResponse.json(categories, {
					status: 200,
					statusText: "Request successful",
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
			statusText: "You are not allowed to read categories",
		});
	}
}
export async function POST(request: NextRequest) {
	const {
		name,

		description,
	}: { name: string; slug: string; description?: string } =
		await request.json();
	const data = await getSession();
	const isPermitted = await hasPermission({
		category: ["create"],
	});
	if (isPermitted.success) {
		try {
			const category = await prisma.category.create({
				data: {
					organizationId: String(data?.session.activeOrganizationId),
					name,

					description,
				},
			});
			if (category) {
				return NextResponse.json(category, {
					status: 201,
					statusText: "category added successfuly",
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
			statusText: "You are not allowed to add category",
		});
	}
}
