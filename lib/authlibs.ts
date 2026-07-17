import { headers } from "next/headers";
import { auth } from "@/lib/auth";
export const getSession = async () => {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	return session;
};

type OneOrMore<T> = [T, ...T[]];

type CrudPermission = "read" | "create" | "update" | "delete";

type PermissionSchema = {
	client?: OneOrMore<CrudPermission>;
	invoice?: OneOrMore<CrudPermission>;
	category?: OneOrMore<CrudPermission>;
	payment?: OneOrMore<CrudPermission>;
	settings?: OneOrMore<CrudPermission>;
	report?: OneOrMore<"read">;
	organization?: OneOrMore<"update" | "delete">;
	member?: OneOrMore<"create" | "update" | "delete">;
	invitation?: OneOrMore<"create" | "cancel">;
	team?: OneOrMore<"create" | "update" | "delete">;
	ac?: OneOrMore<CrudPermission>;
};

export const hasPermission = async (permissions: PermissionSchema) => {
	const isPermitted = await auth.api.hasPermission({
		headers: await headers(),
		body: {
			permissions: permissions,
		},
	});
	return isPermitted;
};
