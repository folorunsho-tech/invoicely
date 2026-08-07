import {
	Invoice,
	Client,
	Item,
	Organization,
	invoiceReciept,
	Category,
} from "./../generated/prisma/client";
type invoiceData = {
	client: Client;
	items: Item[];
	organization: Organization;
	category?: Category;
};
type invoiceRData = {
	client: Client;
	items: Item[];
	organization: Organization;
};

export type invoice = Invoice & invoiceData;
export type invoiceR = Invoice & invoiceRData;
export type Reciept = invoiceReciept & {
	// organization?: Organization;
	invoice: invoiceR;
};
