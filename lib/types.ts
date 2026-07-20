import {
	Invoice,
	Client,
	Item,
	Organization,
	invoiceNotification,
	invoiceReciept,
} from "./../generated/prisma/client";
type invoiceData = {
	client: Client;
	items: Item[];
	organization: Organization;
};
type invoiceRData = {
	client: Client;
	items: Item[];
	organization: Organization;
};
type InvoiceNotificationData = {
	invoice: Invoice;
};
export type invoice = Invoice & invoiceData;
export type invoiceR = Invoice & invoiceRData;
export type InvoiceNotification = invoiceNotification & InvoiceNotificationData;
export type Reciept = invoiceReciept & {
	// organization?: Organization;
	invoice: invoiceR;
};
