"use server";
import { prisma } from "./prisma";
export default async function generateOrgCode(
	orgname: string,
	legnth = 4,
	amount = 0,
) {
	const orgcode = orgname.toUpperCase().substring(0, legnth);
	const codeExist = await prisma.organization.findUnique({
		where: {
			code: orgcode,
		},
	});
	if (codeExist) {
		return `${orgcode}${amount + 1}`;
	} else {
		return orgcode;
	}
}
