import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { emailOTP } from "better-auth/plugins";
import { transporter, sendOrganizationInvitation } from "./email";
import { organization } from "better-auth/plugins";
import { ac, owner, admin, member, editor } from "@/lib/permissions";
export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	baseURL: process.env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			void transporter.sendMail({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`,
				from: process.env.SMTP_FROM,
			});
		},
	},
	advanced: {
		cookiePrefix: "invoicely",
	},

	plugins: [
		organization({
			async sendInvitationEmail(data) {
				const inviteLink = `${process.env.APP_URL}/accept-invitation/${data.id}`;
				sendOrganizationInvitation({
					email: data.email,
					invitedByUsername: data.inviter.user.name,
					// invitedByEmail: data.inviter.user.email,
					inviteLink,
					expiresIn: 2,
					companyName: data.organization.name,
					role: data.role,
				});
			},
			schema: {
				organization: {
					additionalFields: {
						currency: {
							type: "string",
							input: true,
							required: true,
							defaultValue: "NGN",
						},
						currencyPos: {
							type: "string",
							input: true,
							required: true,
							defaultValue: "left",
						},
						currencySymbol: {
							type: "string",
							input: true,
							required: true,
						},
						email: {
							type: "string",
							input: true,
							required: true,
						},
						code: {
							type: "string",
							input: true,
							required: true,
						},
						city: {
							type: "string",
							input: true,
							required: true,
						},
						phone: {
							type: "string",
							input: true,
							required: false,
						},

						address: {
							type: "string",
							input: true,
							required: true,
						},
						state: {
							type: "string",
							input: true,
							required: true,
						},

						country: {
							type: "string",
							input: true,
							required: true,
						},
						postCode: {
							type: "string",
							input: true,
							required: false,
						},
					},
				},
			},
			ac,
			roles: {
				owner,
				admin,
				member,
				editor,
			},
		}),
		emailOTP({
			overrideDefaultEmailVerification: true,
			disableSignUp: true,
			resendStrategy: "reuse",

			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					// Send the OTP for sign in
					void transporter.sendMail({
						from: process.env.SMTP_FROM,
						to: email,
						subject: "Your sign-in OTP",
						html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
					});
				} else if (type === "email-verification") {
					// Send the OTP for email verification
					void transporter.sendMail({
						from: process.env.SMTP_FROM,
						to: email,
						subject: "Verify your email",
						html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
					});
				} else {
					// Send the OTP for password reset
					void transporter.sendMail({
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
