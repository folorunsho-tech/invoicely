import {
	Invoice,
	Client,
	Item,
	Organization,
	invoiceNotification,
} from "./../generated/prisma/client";
type invoiceData = {
	client: Client;
	items: Item[];
	organization: Organization;
};
type InvoiceNotificationData = {
	invoice: Invoice;
};
export type invoice = Invoice & invoiceData;
export type InvoiceNotification = invoiceNotification & InvoiceNotificationData;
