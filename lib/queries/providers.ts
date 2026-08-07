/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "../toaster";
import { InputJsonValue } from "@prisma/client/runtime/client";
import { NullableJsonNullValueInput } from "@/generated/prisma/internal/prismaNamespace";
import { GatewayProvider } from "@/generated/prisma/enums";

const apiUrl = process.env.API_URL || "http://localhost:3000/api/";
const url = `settings/providers`;
export const getProviders = async () => {
	const response = await fetch(apiUrl + url, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};
export const getProvider = async ({ provider }: { provider: string }) => {
	const response = await fetch(apiUrl + `${url}/${provider}`, {
		method: "GET",
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const postProvider = async (data: {
	provider: GatewayProvider;
	isActive: boolean;
	rank: number;
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

export const updateProvider = async ({
	data,
	provider,
}: {
	data: any;
	provider: string;
}) => {
	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiUrl + `${url}/${provider}`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");

	return res;
};
export const toggleProvider = async ({
	data,
	provider,
}: {
	data: any;
	provider: string;
}) => {
	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiUrl + `${url}/${provider}/toggle`, options);
	if (!response.ok) {
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const res = await response.json();
	toast(response.statusText, "success");

	return res;
};
