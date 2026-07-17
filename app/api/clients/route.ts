import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
	// const searchParams = request.nextUrl.searchParams;
	// const limit = Number(searchParams.get("limit"));
	// const page = Number(searchParams.get("page"));
	// const search = String(searchParams.get("search"));
	// const sortBy = String(searchParams.get("sortBy"));
	// const sortOrder = String(searchParams.get("sortOrder"));
	const data = await getSession();
	const isPermitted = await hasPermission({
		client: ["read"],
	});
	if (isPermitted.success) {
		// const skip = (page - 1) * limit;

		try {
			const clients = await prisma.client.findMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					is_deleted: false,
					// OR: [
					// 	{
					// 		name: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		email: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		phone: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		state: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		city: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		state: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		postCode: { contains: search, mode: "insensitive" },
					// 	},
					// 	{
					// 		country: { contains: search, mode: "insensitive" },
					// 	},
					// ],
				},
				orderBy: {
					updatedAt: "desc",
				},
				// [sortBy]: sortOrder,

				include: {
					_count: {
						select: {
							invoices: true,
						},
					},
					organization: {
						select: {
							slug: true,
						},
					},
				},

				// skip,
				// take: limit,
			});
			// const total = await prisma.client.count({
			// 	where: {
			// 		organizationId: String(data?.session.activeOrganizationId),
			// 		is_deleted: false,
			// 		OR: [
			// 			{
			// 				name: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				email: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				phone: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				state: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				city: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				state: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				postCode: { contains: search, mode: "insensitive" },
			// 			},
			// 			{
			// 				country: { contains: search, mode: "insensitive" },
			// 			},
			// 		],
			// 	},
			// });
			// const response = {
			// 	data: clients,
			// 	meta: {
			// 		total,
			// 		page,
			// 		limit,
			// 		totalPages: Math.ceil(total / limit),
			// 		hasNextPage: page < Math.ceil(total / limit),
			// 		hasPrevPage: page > 1,
			// 	},
			// };
			if (clients) {
				return NextResponse.json(clients, {
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
			statusText: "You are not allowed to read clients",
		});
	}
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const data = await getSession();
	const isPermitted = await hasPermission({
		client: ["create"],
	});
	if (isPermitted.success) {
		const isClient = await prisma.client.findUnique({
			where: {
				email: body?.email,
			},
		});
		if (isClient)
			return NextResponse.json(
				{ error: "Client already exist" },
				{
					status: 409,
					statusText: "Client already exist",
				},
			);
		try {
			const client = await prisma.client.create({
				data: { organizationId: data?.session.activeOrganizationId, ...body },
			});
			if (client) {
				return NextResponse.json(client, {
					status: 201,
					statusText: "Client added successfuly",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error adding client",
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
			statusText: "You are not allowed to add client",
		});
	}
}

export async function DELETE(request: NextRequest) {
	const body = await request.json();
	const data = await getSession();
	const toDelete = body.map((id: { id: string }) => id.id);

	const isPermitted = await hasPermission({
		client: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.client.deleteMany({
				where: {
					organizationId: String(data?.session.activeOrganizationId),
					id: {
						in: toDelete,
					},
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: deleted.count + " clients deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting clients",
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
			statusText: "You are not allowed to delete clients",
		});
	}
}
