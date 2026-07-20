import { invoice, Reciept } from "../types";
import { baseLayout } from "./base";
import {
	invoiceSummary,
	invoiceMeta,
	ctaButton,
	formatCurrency,
	formatDate,
	invoiceRSummary,
	invoiceRMeta,
} from "./helper";

// ─── 1. Invoice Receipt Sent ──────────────────────────────────────────────────────────

export function invoiceReceiptTemplate({
	receipt,
	clientName,
	companyName,
}: {
	receipt: Reciept;
	clientName: string;
	companyName: string;
}) {
	const content = `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      ${companyName}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi ${clientName}, 
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
     You have made a successful payment for ${receipt.invoice.invoiceNumber}. Your payment details are
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
     Details:
    </p>
    ${invoiceRMeta(receipt)}
    ${invoiceRSummary(receipt)}

  `;

	return {
		subject: `Receipt for invoice #${receipt.invoice.invoiceNumber}.`,
		html: baseLayout({
			previewText: `Receipt for invoice #${receipt.invoice.invoiceNumber}.`,
			content,
			companyName,
		}),
	};
}
// ─── 1. Invoice Sent ──────────────────────────────────────────────────────────

export function invoiceSentTemplate({
	invoice,
	clientName,
	companyName,
	paymentUrl,
}: {
	invoice: invoice;
	clientName: string;
	companyName: string;
	paymentUrl: string;
}) {
	const content = `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      You have a new invoice
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi ${clientName}, please find your invoice details below.
    </p>

    ${invoiceMeta(invoice)}
    ${invoiceSummary(invoice)}

    ${
			paymentUrl
				? ctaButton({ label: "Pay now", href: paymentUrl, color: "#18181b" })
				: ""
		}

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Payment is due by <strong style="color:#374151;">${formatDate(invoice.due_date)}</strong>.
      If you have questions about this invoice, reply to this email.
    </p>
  `;

	return {
		subject: `Invoice #${invoice.invoiceNumber} — ${formatCurrency(Number(invoice.total), invoice.currency)} due ${formatDate(invoice.due_date)}`,
		html: baseLayout({
			previewText: `Invoice #${invoice.invoiceNumber} for ${formatCurrency(Number(invoice.total), invoice.currency)} is ready.`,
			content,
			companyName,
		}),
	};
}
// ─── 2. Invoice Update Sent ──────────────────────────────────────────────────────────

export function invoiceUpdatedTemplate({
	invoice,
	clientName,
	companyName,
	paymentUrl,
}: {
	invoice: invoice;
	clientName: string;
	companyName: string;
	paymentUrl: string;
}) {
	const content = `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      You have an update on invoice with number # ${invoice.invoiceNumber}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi ${clientName}, please find your invoice details below.
    </p>

    ${invoiceMeta(invoice)}
    ${invoiceSummary(invoice)}

    ${
			paymentUrl
				? ctaButton({ label: "Pay now", href: paymentUrl, color: "#18181b" })
				: ""
		}

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Payment is due by <strong style="color:#374151;">${formatDate(invoice.due_date)}</strong>.
      If you have questions about this invoice, reply to this email.
    </p>
  `;

	return {
		subject: `Invoice #${invoice.invoiceNumber} — ${formatCurrency(Number(invoice.total), invoice.currency)} due ${formatDate(invoice.due_date)}`,
		html: baseLayout({
			previewText: `Invoice #${invoice.invoiceNumber} for ${formatCurrency(Number(invoice.total), invoice.currency)} is ready.`,
			content,
			companyName,
		}),
	};
}

// ─── 2. Cancellation ─────────────────────────────────────────────────────────

export function invoiceCancellationTemplate({
	invoice,
	clientName,
	companyName,
}: {
	invoice: invoice;
	clientName: string;
	companyName: string;
}) {
	const content = `
    <!-- Status badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:20px;padding:4px 12px;">
          <span style="font-size:12px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;">
            Cancelled
          </span>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      Invoice #${invoice.invoiceNumber} has been cancelled
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi ${clientName}, this invoice has been cancelled and no payment is required.
    </p>

    ${invoiceMeta(invoice)}
    ${invoiceSummary(invoice)}


    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
      If you believe this is a mistake or have questions, please reply to this email.
    </p>
  `;

	return {
		subject: `Invoice #${invoice.invoiceNumber} cancelled`,
		html: baseLayout({
			previewText: `Invoice #${invoice.invoiceNumber} for ${formatCurrency(Number(invoice.total), invoice.currency)} has been cancelled.`,
			content,
			companyName,
		}),
	};
}

// ─── 3. 3-Day Reminder ───────────────────────────────────────────────────────

export function invoiceReminder3DayTemplate({
	invoice,
	clientName,
	companyName,
	paymentUrl,
}: {
	invoice: invoice;
	clientName: string;
	companyName: string;
	paymentUrl: string;
}) {
	const content = `
    <!-- Status badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:20px;padding:4px 12px;">
          <span style="font-size:12px;font-weight:600;color:#d97706;text-transform:uppercase;letter-spacing:0.5px;">
            Due in 3 days
          </span>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      Friendly reminder — payment due soon
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi ${clientName}, just a heads-up that invoice #${invoice.invoiceNumber} is due in 3 days on
      <strong style="color:#374151;">${formatDate(invoice.due_date)}</strong>.
    </p>

    ${invoiceMeta(invoice)}
    ${invoiceSummary(invoice)}

    ${
			paymentUrl
				? ctaButton({ label: "Pay now", href: paymentUrl, color: "#d97706" })
				: ""
		}

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      If you've already arranged payment, please disregard this message.
    </p>
  `;

	return {
		subject: `Reminder: Invoice #${invoice.invoiceNumber} due in 3 days`,
		html: baseLayout({
			previewText: `Invoice #${invoice.invoiceNumber} for ${formatCurrency(Number(invoice.total), invoice.currency)} is due in 3 days.`,
			content,
			companyName,
		}),
	};
}

// ─── 4. 1-Day Reminder ───────────────────────────────────────────────────────

export function invoiceReminder1DayTemplate({
	invoice,
	clientName,
	companyName,
	paymentUrl,
}: {
	invoice: invoice;
	clientName: string;
	companyName: string;
	paymentUrl: string;
}) {
	const content = `
    <!-- Status badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:4px 12px;">
          <span style="font-size:12px;font-weight:600;color:#ea580c;text-transform:uppercase;letter-spacing:0.5px;">
            Due tomorrow
          </span>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      Payment due tomorrow
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Hi ${clientName}, this is a reminder that invoice #${invoice.invoiceNumber} is due
      <strong style="color:#374151;">tomorrow, ${formatDate(invoice.due_date)}</strong>.
    </p>

    ${invoiceMeta(invoice)}
    ${invoiceSummary(invoice)}

    ${
			paymentUrl
				? ctaButton({ label: "Pay now", href: paymentUrl, color: "#ea580c" })
				: ""
		}

    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      If you've already arranged payment, please disregard this message. 
      Otherwise, please ensure payment is made before the due date to avoid any late fees.
    </p>
  `;

	return {
		subject: `Action required: Invoice #${invoice.invoiceNumber} due tomorrow`,
		html: baseLayout({
			previewText: `Invoice #${invoice.invoiceNumber} for ${formatCurrency(Number(invoice.total), invoice.currency)} is due tomorrow.`,
			content,
			companyName,
		}),
	};
}
