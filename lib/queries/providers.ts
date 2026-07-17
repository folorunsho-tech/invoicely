import { PaymentGatewayUpdateInput } from "@/generated/prisma/models";
import toast from "../toaster";
import { InputJsonValue } from "@prisma/client/runtime/client";
import { NullableJsonNullValueInput } from "@/generated/prisma/internal/prismaNamespace";

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
		toast(response.statusText, "error");
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const postProvider = async (data: {
	id?: string | undefined;
	provider: string;
	test_public_key?: string | null | undefined;
	test_secret_key?: string | null | undefined;
	live_public_key?: string | null | undefined;
	live_secret_key?: string | null | undefined;
	metadata?: NullableJsonNullValueInput | InputJsonValue | undefined;
	is_live?: boolean;
	is_enabled?: boolean;
	createdAt?: Date | string;
	updatedAt?: Date | string;
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
	data: PaymentGatewayUpdateInput;
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
