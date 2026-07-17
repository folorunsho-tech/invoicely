import { getSession, hasPermission } from "@/lib/authlibs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ clientId: string }> },
) {
	const { clientId } = await params;
	const data = await getSession();

	const isPermitted = await hasPermission({
		client: ["read"],
	});
	if (isPermitted.success) {
		try {
			const found = await prisma.client.findUnique({
				where: {
					id: clientId,
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
							category: true,
						},
					},

					organization: {
						select: {
							slug: true,
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
					statusText: "Client not found",
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
			statusText: "You are not allowed to read client",
		});
	}
}
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ clientId: string }> },
) {
	const { clientId } = await params;
	const data = await getSession();
	const body: {
		name: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		country: string;
		state: string;
		postCode: string;
	} = await request.json();

	const isPermitted = await hasPermission({
		client: ["update"],
	});
	if (isPermitted.success) {
		try {
			const updated = await prisma.client.update({
				where: {
					id: clientId,
					organizationId: String(data?.session.activeOrganizationId),
				},
				data: body,
			});
			if (updated) {
				return NextResponse.json(updated, {
					status: 200,
					statusText: "client updated successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error updating client",
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
			statusText: "You are not allowed to update client",
		});
	}
}
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ clientId: string }> },
) {
	const { clientId } = await params;
	const data = await getSession();
	const isPermitted = await hasPermission({
		client: ["delete"],
	});
	if (isPermitted.success) {
		try {
			const deleted = await prisma.client.delete({
				where: {
					id: clientId,
					organizationId: String(data?.session.activeOrganizationId),
				},
			});
			if (deleted) {
				return NextResponse.json(deleted, {
					status: 200,
					statusText: "client deleted successfully",
				});
			} else {
				return NextResponse.json(null, {
					statusText: "error deleting client",
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
			statusText: "You are not allowed to delete client",
		});
	}
}
