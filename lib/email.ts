/* eslint-disable @typescript-eslint/no-explicit-any */
import { invoice as Invoice, Reciept } from "./types";
import nodemailer from "nodemailer";
import {
	invoiceCancellationTemplate,
	invoiceReceiptTemplate,
	invoiceReminder1DayTemplate,
	invoiceReminder3DayTemplate,
	invoiceSentTemplate,
	invoiceUpdatedTemplate,
} from "./templates";
import { InvoiceNotificationType } from "@/generated/prisma/enums";
import { invitationTemplate } from "./templates/invitation";

export const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	secure: true,
	port: Number(process.env.SMTP_PORT),
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});
export async function sendEmail(options: {
	to: string;
	subject: string;
	html: string;
	from?: string;
}) {
	try {
		const info = await transporter.sendMail({
			from: `${options.from} <${process.env.SMTP_FROM}>`,
			to: options.to,
			subject: options.subject,
			html: options.html,
		});
		if (info.rejected.length > 0) {
			console.warn("Some recipients were rejected:", info.rejected);
		}
		console.log("Message sent:", info.messageId);
		return { success: true, error: null };
	} catch (err: any) {
		switch (err.code) {
			case "ECONNECTION":
			case "ETIMEDOUT":
				console.error("Network error - retry later:", err.message);
				return { success: false, error: err.message };
			case "EAUTH":
				console.error("Authentication failed:", err.message);
				return { success: false, error: err.message };
			case "EENVELOPE":
				// err.rejected is only present when every recipient was refused
				console.error("Invalid envelope:", err.message, err.rejected || []);
				return { success: false, error: err.message };
			default:
				console.error("Send failed:", err.message);
				return { success: false, error: err.message };
		}
	}
}
const APP_URL = process.env.APP_URL || "https://invoicely.tacheyon.com";
function paymentUrl(invoice: Invoice) {
	return `${APP_URL}/invoice/${invoice.id}/pay`;
}

export const sendInvoiceEmail = async ({
	to,
	invoice,
}: {
	to: string | any;
	invoice: Invoice | any;
}) => {
	const { subject, html } = invoiceSentTemplate({
		invoice: invoice,
		clientName: invoice?.client?.name,
		companyName: invoice?.organization?.name,
		paymentUrl: paymentUrl(invoice),
	});
	return await sendEmail({
		to,
		subject,
		html,
		from: invoice?.organization?.name,
	});
};

export const sendRecieptEmail = async ({
	to,
	receipt,
}: {
	to: string | any;
	receipt: Reciept;
}) => {
	const { subject, html } = invoiceReceiptTemplate({
		receipt: receipt,
		clientName: receipt.invoice?.client?.name,
		companyName: receipt.invoice?.organization?.name,
	});
	return await sendEmail({
		to,
		subject,
		html,
		from: `Receipt-${receipt.invoice?.organization?.name}`,
	});
};

export const sendInvoiceUpdatedEmail = async ({
	to,
	invoice,
}: {
	to: string | any;
	invoice: Invoice | any;
}) => {
	const { subject, html } = invoiceUpdatedTemplate({
		invoice: invoice,
		clientName: invoice?.client?.name,
		companyName: invoice?.organization?.name,
		paymentUrl: paymentUrl(invoice),
	});
	return await sendEmail({
		to,
		subject,
		html,
		from: invoice?.organization?.name,
	});
};

export const sendCancellationEmail = async ({
	to,
	invoice,
}: {
	to: string | any;
	invoice: Invoice | any;
}) => {
	const { subject, html } = invoiceCancellationTemplate({
		invoice: invoice,
		clientName: invoice?.client?.name,
		companyName: invoice?.organization?.name,
	});
	return await sendEmail({
		to,
		subject,
		html,
		from: invoice?.organization?.name,
	});
};

export const sendReminderEmail = async ({
	to,
	invoice,
	reminderType,
}: {
	to: string | any;
	invoice: Invoice | any;
	reminderType: InvoiceNotificationType;
}) => {
	const templateFn =
		reminderType === "REMINDER_1D"
			? invoiceReminder1DayTemplate
			: invoiceReminder3DayTemplate;
	const { subject, html } = templateFn({
		invoice: invoice,

		clientName: invoice?.client?.name,
		companyName: invoice?.organization?.name,

		paymentUrl: paymentUrl(invoice),
	});
	return await sendEmail({
		to,
		subject,
		html,
		from: invoice?.organization?.name,
	});
};

export const sendOrganizationInvitation = async ({
	email,
	invitedByUsername,
	// invitedByEmail,
	inviteLink,
	expiresIn,
	companyName,
	role,
}: {
	email: string;
	invitedByUsername: string;
	// invitedByEmail: string;
	inviteLink: string;
	expiresIn: number;
	companyName: string;
	role: string;
}) => {
	const { subject, html } = invitationTemplate({
		inviterName: invitedByUsername,
		companyName,
		inviteUrl: inviteLink,
		expiresInDays: expiresIn,
		role,
	});
	return await sendEmail({
		to: email,
		subject,
		html,
		from: companyName,
	});
};
