import { da } from "date-fns/locale";
import toast from "../toaster";
// {
// 	limit = 50,
// 	page = 1,
// 	search = "",
// 	sortBy = "updatedAt",
// 	sortOrder = "desc",
// }: {
// 	limit?: number;
// 	page?: number;
// 	search?: string;
// 	sortBy?: string;
// 	sortOrder?: string;
// }
// ?limit=${limit}&page=${page}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}

const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
const url = `notifications`;
export const getAllNotifications = async () => {
	const response = await fetch(apiUrl + `${url}/all`, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();

	return data;
};
export const getNotifications = async () => {
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const deleteNotification = async ({ id }: { id: string }) => {
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
export const markNotification = async ({ id }: { id: string }) => {
	const response = await fetch(apiUrl + `${url}/${id}`, {
		method: "PATCH",
	});
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();

	return {
		success: response.status == 200,
		data,
		statusText: response.statusText,
	};
};
