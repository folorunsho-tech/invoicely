"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceReceiptTemplate = invoiceReceiptTemplate;
exports.invoiceOverdueTemplate = invoiceOverdueTemplate;
exports.invoiceSentTemplate = invoiceSentTemplate;
exports.invoiceUpdatedTemplate = invoiceUpdatedTemplate;
exports.invoiceCancellationTemplate = invoiceCancellationTemplate;
exports.invoiceReminder3DayTemplate = invoiceReminder3DayTemplate;
exports.invoiceReminder1DayTemplate = invoiceReminder1DayTemplate;
var base_1 = require("./base");
var helper_1 = require("./helper");
// ─── 1. Invoice Receipt Sent ──────────────────────────────────────────────────────────
function invoiceReceiptTemplate(_a) {
    var receipt = _a.receipt, clientName = _a.clientName, companyName = _a.companyName;
    var content = "\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      ".concat(companyName, "\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ").concat(clientName, ", \n    </p>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n     You have made a successful payment for ").concat(receipt.invoice.invoiceNumber, ". Your payment details are\n    </p>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n     Details:\n    </p>\n    ").concat((0, helper_1.invoiceRMeta)(receipt), "\n    ").concat((0, helper_1.invoiceRSummary)(receipt), "\n\n  ");
    return {
        subject: "Receipt for invoice #".concat(receipt.invoice.invoiceNumber, "."),
        html: (0, base_1.baseLayout)({
            previewText: "Receipt for invoice #".concat(receipt.invoice.invoiceNumber, "."),
            content: content,
            companyName: companyName,
        }),
    };
}
// ─── 1. Invoice Sent ──────────────────────────────────────────────────────────
function invoiceOverdueTemplate(_a) {
    var invoice = _a.invoice, clientName = _a.clientName, companyName = _a.companyName, paymentUrl = _a.paymentUrl, overdueBy = _a.overdueBy;
    var content = "\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      Your invoice #".concat(invoice.invoiceNumber, " is overdue by ").concat(overdueBy, "\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ").concat(clientName, ", please find your invoice details below.\n    </p>\n\n    ").concat((0, helper_1.invoiceMeta)(invoice), "\n    ").concat((0, helper_1.invoiceSummary)(invoice), "\n\n    ").concat(paymentUrl
        ? (0, helper_1.ctaButton)({ label: "Pay now", href: paymentUrl, color: "#18181b" })
        : "", "\n\n    <p style=\"margin:0;font-size:13px;color:#9ca3af;line-height:1.6;\">\n      Payment was due by <strong style=\"color:#374151;\">").concat((0, helper_1.formatDate)(invoice.due_date), "</strong>.\n      If you have questions about this invoice, contact support.\n    </p>\n  ");
    return {
        subject: "Invoice #".concat(invoice.invoiceNumber, " \u2014 ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " due ").concat((0, helper_1.formatDate)(invoice.due_date)),
        html: (0, base_1.baseLayout)({
            previewText: "Invoice #".concat(invoice.invoiceNumber, " for ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " is ready."),
            content: content,
            companyName: companyName,
        }),
    };
}
function invoiceSentTemplate(_a) {
    var invoice = _a.invoice, clientName = _a.clientName, companyName = _a.companyName, paymentUrl = _a.paymentUrl;
    var content = "\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      You have a new invoice\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ".concat(clientName, ", please find your invoice details below.\n    </p>\n\n    ").concat((0, helper_1.invoiceMeta)(invoice), "\n    ").concat((0, helper_1.invoiceSummary)(invoice), "\n\n    ").concat(paymentUrl
        ? (0, helper_1.ctaButton)({ label: "Pay now", href: paymentUrl, color: "#18181b" })
        : "", "\n\n    <p style=\"margin:0;font-size:13px;color:#9ca3af;line-height:1.6;\">\n      Payment is due by <strong style=\"color:#374151;\">").concat((0, helper_1.formatDate)(invoice.due_date), "</strong>.\n      If you have questions about this invoice, contact support.\n    </p>\n  ");
    return {
        subject: "Invoice #".concat(invoice.invoiceNumber, " \u2014 ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " due ").concat((0, helper_1.formatDate)(invoice.due_date)),
        html: (0, base_1.baseLayout)({
            previewText: "Invoice #".concat(invoice.invoiceNumber, " for ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " is ready."),
            content: content,
            companyName: companyName,
        }),
    };
}
// ─── 2. Invoice Update Sent ──────────────────────────────────────────────────────────
function invoiceUpdatedTemplate(_a) {
    var invoice = _a.invoice, clientName = _a.clientName, companyName = _a.companyName, paymentUrl = _a.paymentUrl;
    var content = "\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      You have an update on invoice with number # ".concat(invoice.invoiceNumber, "\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ").concat(clientName, ", please find your invoice details below.\n    </p>\n\n    ").concat((0, helper_1.invoiceMeta)(invoice), "\n    ").concat((0, helper_1.invoiceSummary)(invoice), "\n\n    ").concat(paymentUrl
        ? (0, helper_1.ctaButton)({ label: "Pay now", href: paymentUrl, color: "#18181b" })
        : "", "\n\n    <p style=\"margin:0;font-size:13px;color:#9ca3af;line-height:1.6;\">\n      Payment is due by <strong style=\"color:#374151;\">").concat((0, helper_1.formatDate)(invoice.due_date), "</strong>.\n      If you have questions about this invoice, contact support.\n    </p>\n  ");
    return {
        subject: "Invoice #".concat(invoice.invoiceNumber, " \u2014 ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " due ").concat((0, helper_1.formatDate)(invoice.due_date)),
        html: (0, base_1.baseLayout)({
            previewText: "Invoice #".concat(invoice.invoiceNumber, " for ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " is ready."),
            content: content,
            companyName: companyName,
        }),
    };
}
// ─── 2. Cancellation ─────────────────────────────────────────────────────────
function invoiceCancellationTemplate(_a) {
    var invoice = _a.invoice, clientName = _a.clientName, companyName = _a.companyName;
    var content = "\n    <!-- Status badge -->\n    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:20px;\">\n      <tr>\n        <td style=\"background-color:#fef2f2;border:1px solid #fecaca;border-radius:20px;padding:4px 12px;\">\n          <span style=\"font-size:12px;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;\">\n            Cancelled\n          </span>\n        </td>\n      </tr>\n    </table>\n\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      Invoice #".concat(invoice.invoiceNumber, " has been cancelled\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ").concat(clientName, ", this invoice has been cancelled and no payment is required.\n    </p>\n\n    ").concat((0, helper_1.invoiceMeta)(invoice), "\n    ").concat((0, helper_1.invoiceSummary)(invoice), "\n\n\n    <p style=\"margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;\">\n      If you believe this is a mistake or have questions, contact support.\n    </p>\n  ");
    return {
        subject: "Invoice #".concat(invoice.invoiceNumber, " cancelled"),
        html: (0, base_1.baseLayout)({
            previewText: "Invoice #".concat(invoice.invoiceNumber, " for ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " has been cancelled."),
            content: content,
            companyName: companyName,
        }),
    };
}
// ─── 3. 3-Day Reminder ───────────────────────────────────────────────────────
function invoiceReminder3DayTemplate(_a) {
    var invoice = _a.invoice, clientName = _a.clientName, companyName = _a.companyName, paymentUrl = _a.paymentUrl;
    var content = "\n    <!-- Status badge -->\n    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:20px;\">\n      <tr>\n        <td style=\"background-color:#fffbeb;border:1px solid #fde68a;border-radius:20px;padding:4px 12px;\">\n          <span style=\"font-size:12px;font-weight:600;color:#d97706;text-transform:uppercase;letter-spacing:0.5px;\">\n            Due in 3 days\n          </span>\n        </td>\n      </tr>\n    </table>\n\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      Friendly reminder \u2014 payment due soon\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ".concat(clientName, ", just a heads-up that invoice #").concat(invoice.invoiceNumber, " is due in 3 days on\n      <strong style=\"color:#374151;\">").concat((0, helper_1.formatDate)(invoice.due_date), "</strong>.\n    </p>\n\n    ").concat((0, helper_1.invoiceMeta)(invoice), "\n    ").concat((0, helper_1.invoiceSummary)(invoice), "\n\n    ").concat(paymentUrl
        ? (0, helper_1.ctaButton)({ label: "Pay now", href: paymentUrl, color: "#d97706" })
        : "", "\n\n    <p style=\"margin:0;font-size:13px;color:#9ca3af;line-height:1.6;\">\n      If you've already arranged payment, please disregard this message.\n    </p>\n  ");
    return {
        subject: "Reminder: Invoice #".concat(invoice.invoiceNumber, " due in 3 days"),
        html: (0, base_1.baseLayout)({
            previewText: "Invoice #".concat(invoice.invoiceNumber, " for ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " is due in 3 days."),
            content: content,
            companyName: companyName,
        }),
    };
}
// ─── 4. 1-Day Reminder ───────────────────────────────────────────────────────
function invoiceReminder1DayTemplate(_a) {
    var invoice = _a.invoice, clientName = _a.clientName, companyName = _a.companyName, paymentUrl = _a.paymentUrl;
    var content = "\n    <!-- Status badge -->\n    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:20px;\">\n      <tr>\n        <td style=\"background-color:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:4px 12px;\">\n          <span style=\"font-size:12px;font-weight:600;color:#ea580c;text-transform:uppercase;letter-spacing:0.5px;\">\n            Due tomorrow\n          </span>\n        </td>\n      </tr>\n    </table>\n\n    <h1 style=\"margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      Payment due tomorrow\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;\">\n      Hi ".concat(clientName, ", this is a reminder that invoice #").concat(invoice.invoiceNumber, " is due\n      <strong style=\"color:#374151;\">tomorrow, ").concat((0, helper_1.formatDate)(invoice.due_date), "</strong>.\n    </p>\n\n    ").concat((0, helper_1.invoiceMeta)(invoice), "\n    ").concat((0, helper_1.invoiceSummary)(invoice), "\n\n    ").concat(paymentUrl
        ? (0, helper_1.ctaButton)({ label: "Pay now", href: paymentUrl, color: "#ea580c" })
        : "", "\n\n    <p style=\"margin:0;font-size:13px;color:#9ca3af;line-height:1.6;\">\n      If you've already arranged payment, please disregard this message. \n      Otherwise, please ensure payment is made before the due date to avoid any late fees.\n    </p>\n  ");
    return {
        subject: "Action required: Invoice #".concat(invoice.invoiceNumber, " due tomorrow"),
        html: (0, base_1.baseLayout)({
            previewText: "Invoice #".concat(invoice.invoiceNumber, " for ").concat((0, helper_1.formatCurrency)(Number(invoice.total), invoice.currency), " is due tomorrow."),
            content: content,
            companyName: companyName,
        }),
    };
}
