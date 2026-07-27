import { authClient } from "../auth-client";
import toast from "../toaster";
export const sendInvitation = async ({
	email,
	organizationId,
	role = "member",
}: {
	email: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	role: any;
	organizationId: string;
}) => {
	const { data, error } = await authClient.organization.inviteMember({
		email, // required
		role, // required
		organizationId,
		resend: true,
	});
	if (error) {
		console.log(error);
		toast(error.message, "error");
		throw new Error(`HTTP error! Status: ${error.status}`);
	}
	toast("Invitation sent seccessfully to " + email, "success");
	return data;
};
const apiUrl = process.env.API_URL || "http://localhost:3000/api/";

export const acceptInvitation = async ({
	id,
	email,
}: {
	id: string;
	email: string;
}) => {
	const url = `settings/invitations/${id}/accept`;
	const response = await fetch(apiUrl + url, {
		method: "PATCH",
		body: JSON.stringify({ email }),
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const rejectInvitation = async (id: string) => {
	const url = `settings/invitations/${id}/reject`;
	const response = await fetch(apiUrl + url, {
		method: "PATCH",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const cancelInvitation = async (id: string) => {
	const { data, error } = await authClient.organization.cancelInvitation({
		invitationId: id, // required
	});
	if (error) {
		toast(error.message, "error");
		throw new Error(`HTTP error! Status: ${error.status}`);
	}
	toast("Invitation cancelled", "success");
	return data;
};
export const getInvitation = async (id: string) => {
	const url = `settings/invitations/${id}`;
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getInvitations = async () => {
	const url = `settings/invitations`;
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
