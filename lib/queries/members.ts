/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient } from "@/lib/auth-client";
import toast from "../toaster";
const apiUrl = process.env.API_URL || "http://localhost:3000/api/";

export const getOrgMembers = async (id: string) => {
	const { data, error } = await authClient.organization.listMembers({
		query: {
			organizationId: id,
			sortBy: "createdAt",
			sortDirection: "desc",
		},
	});
	if (error) {
		toast(error.message, "error");
		throw new Error(`HTTP error! Status: ${error.status}`);
	}
	return data;
};

export const addMember = async ({
	user,
	inviteId,
}: {
	user: any;
	inviteId: string | null;
}) => {
	const url = `settings/members/add-member`;
	if (!inviteId) {
		toast("Invite id missing", "error");
	}
	const response = await fetch(apiUrl + url, {
		method: "POST",
		body: JSON.stringify({ user, inviteId }),
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const addExistingMember = async ({
	email,
	inviteId,
}: {
	email: string;
	inviteId: string | null;
}) => {
	const url = `settings/members/add-member`;
	if (!inviteId) {
		toast("Invite id missing", "error");
	}
	const response = await fetch(apiUrl + url, {
		method: "PATCH",
		body: JSON.stringify({ email, inviteId }),
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const removeMember = async ({
	id,
	orgId,
}: {
	id: string;
	orgId: string;
}) => {
	const { data, error } = await authClient.organization.removeMember({
		memberIdOrEmail: id, // required
		organizationId: orgId,
	});
	if (error) {
		toast(error.message, "error");
		throw new Error(`HTTP error! Status: ${error.status}`);
	}
	toast("Member removed successfuly", "success");
	return data;
};
export const leaveOrg = async (orgId: string, orgName: string) => {
	const { data, error } = await authClient.organization.leave({
		organizationId: orgId, // required
	});
	if (error) {
		toast(error.message, "error");
		throw new Error(`HTTP error! Status: ${error.status}`);
	}
	toast(`You have left ${orgName}`, "success");
	return data;
};
