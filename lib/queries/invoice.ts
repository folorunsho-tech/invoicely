import { InvoiceUpdateInput, ItemUpdateInput } from "@/generated/prisma/models";
import toast from "../toaster";

const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
const url = `invoices`;
export const getInvoices = async () => {
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getInvoice = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `${url}/${id}`, {
		method: "GET",
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getTrashInvoices = async () => {
	const response = await fetch(apiUrl + url + "/trash", {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const deleteInvoice = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `${url}/${id}`, {
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
export const trashInvoice = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `${url}/${id}/trash`, {
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
export const deleteInvoices = async (ids: { id: string }[]) => {
	const response = await fetch(apiUrl + `${url}`, {
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
export const trashInvoices = async (ids: { id: string }[]) => {
	const response = await fetch(apiUrl + `${url}/trashmany`, {
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
export const sendInvoice = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `${url}/${id}/send`, {
		method: "POST",
		body: JSON.stringify({ id }),
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};
export const markInvoiceCancelled = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `${url}/${id}/cancel`, {
		method: "PATCH",
		body: JSON.stringify({ id }),
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	toast(response.statusText, "success");

	return data;
};
export const restoreInvoices = async (ids: { id: string }[]) => {
	const response = await fetch(apiUrl + `${url}/trash/restore`, {
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
export const postInvoice = async (data: {
	issued_date: string | Date;
	due_date: string | Date;
	project_subject?: string | null | undefined;
	items: {
		name: string;
		rate: number;
		quantity: number;
	}[];
	categoryId?: string | null;
	clientId: string;
	status?: string;
}) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiUrl + `${url}`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");
	return res;
};
type items = {
	items: ItemUpdateInput[];
};
export const updateInvoice = async ({
	data,
	id,
}: {
	data: InvoiceUpdateInput & items;
	id: string;
}) => {
	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiUrl + `${url}/${id}`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");

	return res;
};
