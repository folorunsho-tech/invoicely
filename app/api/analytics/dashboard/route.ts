import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/authlibs";

export const GET = async () => {
	const data = await getSession();

	const isPermitted = await hasPermission({
		notifications: ["read"],
	});
	const organizationId = String(data?.session.activeOrganizationId);
	if (isPermitted.success) {
		try {
			const clients = await prisma.client.count({
				where: {
					organizationId,
				},
			});
			const invoices = await prisma.invoice.count({
				where: {
					organizationId,
				},
			});
			const revenue = await prisma.payment.findMany({
				where: {
					orgId: organizationId,
					status: "Successful",
				},
				select: {
					amount: true,
				},
			});
			const revSum = revenue?.reduce((prev, next) => {
				return prev + Number(next.amount);
			}, 0);
			if (clients && invoices && revenue) {
				return NextResponse.json(
					{
						clients,
						invoices,
						revenue: revSum,
					},
					{
						status: 200,
						statusText: "Request successful",
					},
				);
			} else {
				return NextResponse.json(
					{ clients, invoices, revenue: revSum },
					{
						status: 400,
						statusText: "Error getting dashboard data",
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
	} else {
		return NextResponse.json(isPermitted.error, {
			status: 403,
			statusText: "You are not allowed to read dashboard data",
		});
	}
};
