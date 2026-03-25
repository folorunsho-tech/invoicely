import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Prisma } from "@/generated/prisma/client";
import { emailOTP } from "better-auth/plugins";
import { transporter } from "./email";
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
					transporter.sendMail({
						from: process.env.SMTP_FROM,
						to: email,
						subject: "Your sign-in OTP",
						html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
					});
				} else if (type === "email-verification") {
					// Send the OTP for email verification
					transporter.sendMail({
						from: process.env.SMTP_FROM,
						to: email,
						subject: "Verify your email",
						html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
					});
				} else {
					// Send the OTP for password reset
					transporter.sendMail({
						from: process.env.SMTP_FROM,
						to: email,
						subject: "Your password reset OTP",
						html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
					});
				}
			},
		}),
	],
});
