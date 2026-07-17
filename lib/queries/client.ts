import toast from "../toaster";

const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
export const getClients = async () => {
	const url = `clients`;
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getTrashClients = async () => {
	const url = `clients/trash`;
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getClient = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `clients/${id}`, {
		method: "GET",
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const deleteClient = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `clients/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};
export const deleteClients = async (ids: { id: string }[]) => {
	const response = await fetch(apiUrl + `clients`, {
		method: "DELETE",
		body: JSON.stringify(ids),
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};
export const restoreClients = async (ids: { id: string }[]) => {
	const response = await fetch(apiUrl + `clients/trash/restore`, {
		method: "PATCH",
		body: JSON.stringify(ids),
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};
export const trashClients = async (ids: { id: string }[]) => {
	const response = await fetch(apiUrl + `clients/trashmany`, {
		method: "PATCH",
		body: JSON.stringify(ids),
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};
export const trashClient = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `clients/${id}/trash`, {
		method: "PATCH",
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};

export const postClient = async ({
	data,
}: {
	data: {
		name: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		country: string;
		state: string;
		postCode: string;
	};
}) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiUrl + `clients`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");
	return res;
};

export const updateClient = async ({
	data,
	id,
}: {
	data: {
		name: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		country: string;
		state: string;
		postCode: string;
	};
	id: string;
}) => {
	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiUrl + `clients/${id}`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");

	return res;
};
