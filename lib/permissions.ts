import { createAccessControl } from "better-auth/plugins/access";
import {
	defaultStatements,
	adminAc,
	ownerAc,
	memberAc,
} from "better-auth/plugins/organization/access";
const statement = {
	...defaultStatements,
	client: ["read", "create", "update", "delete"],
	invoice: ["read", "create", "update", "delete"],
	category: ["read", "create", "update", "delete"],
	payment: ["read", "create", "update", "delete"],
	settings: ["read", "create", "update", "delete"],
	analytics: ["read"],
} as const;
export const ac = createAccessControl(statement);

export const owner = ac.newRole({
	...ownerAc.statements,
	client: ["read", "create", "update", "delete"],
	invoice: ["read", "create", "update", "delete"],
	payment: ["read", "create", "update", "delete"],
	analytics: ["read"],
	category: ["read", "create", "update", "delete"],
	settings: ["read", "create", "update", "delete"],
});
export const admin = ac.newRole({
	...adminAc.statements,
	client: ["read", "create", "update", "delete"],
	invoice: ["read", "create", "update", "delete"],
	payment: ["read", "create", "update", "delete"],
	analytics: ["read"],
	category: ["read", "create", "update", "delete"],
	settings: ["read", "create", "update", "delete"],
});
export const member = ac.newRole({
	...memberAc.statements,
	client: ["read"],
	invoice: ["read"],
	analytics: ["read"],
	category: ["read"],
	payment: ["read"],
});
export const editor = ac.newRole({
	...memberAc.statements,
	client: ["read", "create", "update"],
	invoice: ["read", "create", "update"],
	payment: ["read", "create", "update"],
	category: ["read", "create", "update"],
	analytics: ["read"],
});
