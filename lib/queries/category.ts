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
const url = `categories`;
export const getCategories = async () => {
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getCategory = async ({ id }: { id: string }) => {
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
export const deleteCategory = async ({ id }: { id: string }) => {
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
export const deleteCategories = async (ids: { id: string }[]) => {
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

export const postCategory = async ({
	name,
	description,
	slug,
}: {
	name: string;
	description?: string;
	slug?: string;
}) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name, description, slug }),
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

export const updateCategory = async ({
	data,
	id,
}: {
	data: {
		name: string;
		description?: string;
		slug?: string;
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
	const response = await fetch(apiUrl + `${url}/${id}`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");

	return res;
};
