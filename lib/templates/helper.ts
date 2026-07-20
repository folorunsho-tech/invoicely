import { Invoice } from "@/generated/prisma/client";
import { invoice, Reciept } from "../types";

/**
 * Renders the invoice summary block (line items + total).
 * Used across send, reminder, and cancellation templates.
 */
export function invoiceSummary(invoice: invoice) {
	const rows = invoice?.items
		.map(
			(item) => `
      <tr>
        <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">
          ${item.name}
        </td>
        <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
          ${item.quantity} × ${formatCurrency(Number(item.rate), invoice.currency)}
        </td>
        <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
          ${formatCurrency(item.quantity * Number(item.rate), invoice.currency)}
        </td>
      </tr>`,
		)
		.join("");

	return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin:24px 0;">

      <!-- Table header -->
      <tr style="background-color:#f9fafb;">
        <th style="padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
        <th style="padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Qty × Price</th>
        <th style="padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
      </tr>

      <!-- Line items -->
      <tr>
        <td colspan="3" style="padding:0 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${rows}
          </table>
        </td>
      </tr>

      <!-- Total -->
      <tr style="background-color:#f9fafb;">
        <td colspan="2" style="padding:12px;font-size:14px;font-weight:600;color:#111827;">Total</td>
        <td style="padding:12px;font-size:16px;font-weight:700;color:#111827;text-align:right;">
          ${formatCurrency(Number(invoice.total), invoice.currency)}
        </td>
      </tr>

    </table>
  `;
}
export function invoiceRSummary(receipt: Reciept) {
	const rows = receipt.invoice?.items
		.map(
			(item) => `
      <tr>
        <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">
          ${item.name}
        </td>
        <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
          ${item.quantity} × ${formatCurrency(Number(item.rate), receipt.invoice.currency)}
        </td>
        <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
          ${formatCurrency(item.quantity * Number(item.rate), receipt.invoice.currency)}
        </td>
      </tr>`,
		)
		.join("");

	return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin:24px 0;">

      <!-- Table header -->
      <tr style="background-color:#f9fafb;">
        <th style="padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
        <th style="padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Qty × Price</th>
        <th style="padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
      </tr>

      <!-- Line items -->
      <tr>
        <td colspan="3" style="padding:0 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${rows}
          </table>
        </td>
      </tr>

      <!-- Total -->
      <tr style="background-color:#f9fafb;">
        <td colspan="2" style="padding:12px;font-size:14px;font-weight:600;color:#111827;">Total</td>
        <td style="padding:12px;font-size:16px;font-weight:700;color:#111827;text-align:right;">
          ${formatCurrency(Number(receipt.invoice.total), receipt.invoice.currency)}
        </td>
      </tr>

    </table>
  `;
}

/**
 * Format a number as currency.
 * Falls back to NGN if currency is not provided.
 */
export function formatCurrency(amount: number, currency = "NGN") {
	return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(
		amount,
	);
}

/**
 * Format a date as "Jan 1, 2025".
 */
export function formatDate(date: Date | string) {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Renders a prominent CTA button.
 */
export function ctaButton({
	label,
	href,
	color = "#18181b",
}: {
	label: string;
	href: string;
	color: string;
}) {
	return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td style="border-radius:6px;background-color:${color};">
          <a href="${href}" target="_blank"
            style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;letter-spacing:0.1px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Renders the invoice meta row (invoice #, issue date, due date).
 */
export function invoiceMeta(invoice: Invoice) {
	return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background-color:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
      <tr>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;">Invoice</td>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;text-align:right;">Issued</td>
      </tr>
      <tr>
        <td style="font-size:14px;font-weight:600;color:#111827;">#${invoice.invoiceNumber}</td>
        <td style="font-size:14px;font-weight:600;color:#111827;text-align:right;">${formatDate(invoice.issued_date)}</td>
      </tr>
      ${
				invoice.due_date
					? `
      <tr><td colspan="2" style="padding-top:12px;"></td></tr>
      <tr>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;">Due date</td>
      </tr>
      <tr>
        <td style="font-size:14px;font-weight:600;color:#111827;">${formatDate(invoice.due_date)}</td>
      </tr>`
					: ""
			}
    </table>
  `;
}
/* * Renders the invoice meta row (invoice #, transaction date, recieptId).
 */
export function invoiceRMeta(receipt: Reciept) {
	return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background-color:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
      <tr>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;">Invoice</td>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;text-align:right;">Transaction Date</td>
      </tr>
      <tr>
        <td style="font-size:14px;font-weight:600;color:#111827;">#${receipt.invoice.invoiceNumber}</td>
        <td style="font-size:14px;font-weight:600;color:#111827;text-align:right;">${formatDate(receipt.invoice.paidAt || "")}</td>
      </tr>
    
      <tr><td colspan="2" style="padding-top:12px;"></td></tr>
      <tr>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;">Transaction Id</td>
      </tr>
      <tr>
        <td style="font-size:14px;font-weight:600;color:#111827;">${receipt.paymentId}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:#6b7280;padding-bottom:4px;">Receipt Id</td>
      </tr>
      <tr>
        <td style="font-size:14px;font-weight:600;color:#111827;">${receipt.id}</td>
      </tr>
		
    </table>
  `;
}
