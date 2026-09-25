import { createAuthClient } from "better-auth/react";
import { emailOTPClient, usernameClient } from "better-auth/client/plugins";
import {
	organizationClient,
	inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { ac, owner, admin, member, editor, demo } from "@/lib/permissions";
import type { auth } from "@/lib/auth";
import { inboxClient } from "better-inbox/client";

export const authClient = createAuthClient({
	plugins: [
		emailOTPClient(),
		organizationClient({
			ac,
			roles: {
				owner,
				admin,
				member,
				editor,
				demo,
			},
			schema: inferOrgAdditionalFields<typeof auth>(),
		}),
		inboxClient(),
		usernameClient(),
	],
});
