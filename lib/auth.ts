import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Prisma } from "@/generated/prisma/client";
import { emailOTP } from "better-auth/plugins";
export const auth = betterAuth({
	database: prismaAdapter(Prisma, { provider: "postgresql" }),
	baseURL: process.env.BETTER_AUTH_URL,
	emailAndPassword: { enabled: true, autoSignIn: false },
	advanced: {
		cookiePrefix: "invoicely",
	},
	plugins: [
		emailOTP({
			overrideDefaultEmailVerification: true,
			disableSignUp: true,
			resendStrategy: "reuse",
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					// Send the OTP for sign in
				} else if (type === "email-verification") {
					// Send the OTP for email verification
				} else {
					// Send the OTP for password reset
				}
			},
		}),
	],
});
