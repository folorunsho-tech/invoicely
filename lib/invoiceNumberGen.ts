import { prisma } from "./prisma";

function pad(num: number, size = 6) {
	return String(num).padStart(size, "0");
}

export async function generateInvoiceNumber(orgId: string) {
	const year = new Date().getFullYear();

	const sequence = await prisma.$transaction(async (tx) => {
		const counter = await tx.invoiceCounter.upsert({
			where: {
				orgId_year: {
					orgId,
					year,
				},
			},
			create: {
				orgId,
				year,
				sequence: 1,
			},
			update: {
				sequence: { increment: 1 },
			},
		});

		return counter.sequence;
	});

	// Optional: get org code (cached in real systems)
	const org = await prisma.organization.findUnique({
		where: { id: orgId },
		select: { code: true },
	});

	return `INV-${org?.code}-${year}-${pad(sequence)}`;
}
