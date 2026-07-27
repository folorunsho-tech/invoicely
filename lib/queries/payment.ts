/* eslint-disable @typescript-eslint/no-explicit-any */

import toast from "../toaster";

const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
const url = `payments`;
export const getPayments = async () => {
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getPayment = async ({ id }: { id: string }) => {
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
export const getTrashPayments = async () => {
	const response = await fetch(apiUrl + url + "/trash", {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const deletePayment = async ({ id }: { id: string }) => {
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
export const trashPayment = async ({ id }: { id: string }) => {
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
export const deletePayments = async (ids: { id: string }[]) => {
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
export const trashPayments = async (ids: { id: string }[]) => {
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
export const restorePayments = async (ids: { id: string }[]) => {
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
export const postPayment = async (data: any) => {
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

export const updatePayment = async ({
	data,
	id,
}: {
	data: any;
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

export const initTransaction = async (invoiceId: string) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ invoiceId }),
	};
	const response = await fetch(apiUrl + `${url}/init`, options);
	const res = await response.json();
	// if (!response.ok) {
	// 	// console.log("init tnx func: ", res);
	// 	throw new Error(`HTTP error! Status: ${response.status}`);
	// }
	return res;
};
export const sendReceipt = async (paymentId: string) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ paymentId }),
	};
	const response = await fetch(
		apiUrl + `${url}/${paymentId}/send-receipt`,
		options,
	);
	const res = await response.json();
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	toast(response.statusText, "success");
	return res;
};
