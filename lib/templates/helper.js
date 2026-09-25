"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSummary = invoiceSummary;
exports.invoiceRSummary = invoiceRSummary;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.ctaButton = ctaButton;
exports.invoiceMeta = invoiceMeta;
exports.invoiceRMeta = invoiceRMeta;
/**
 * Renders the invoice summary block (line items + total).
 * Used across send, reminder, and cancellation templates.
 */
function invoiceSummary(invoice) {
    var rows = invoice === null || invoice === void 0 ? void 0 : invoice.items.map(function (item) { return "\n      <tr>\n        <td style=\"padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;\">\n          ".concat(item.name, "\n        </td>\n        <td style=\"padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;\">\n          ").concat(item.quantity, " \u00D7 ").concat(formatCurrency(Number(item.rate), invoice.currency), "\n        </td>\n        <td style=\"padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;\">\n          ").concat(formatCurrency(item.quantity * Number(item.rate), invoice.currency), "\n        </td>\n      </tr>"); }).join("");
    return "\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n      style=\"border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin:24px 0;\">\n\n      <!-- Table header -->\n      <tr style=\"background-color:#f9fafb;\">\n        <th style=\"padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.5px;\">Description</th>\n        <th style=\"padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;\">Qty \u00D7 Price</th>\n        <th style=\"padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;\">Amount</th>\n      </tr>\n\n      <!-- Line items -->\n      <tr>\n        <td colspan=\"3\" style=\"padding:0 12px;\">\n          <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n            ".concat(rows, "\n          </table>\n        </td>\n      </tr>\n\n      <!-- Total -->\n      <tr style=\"background-color:#f9fafb;\">\n        <td colspan=\"2\" style=\"padding:12px;font-size:14px;font-weight:600;color:#111827;\">Total</td>\n        <td style=\"padding:12px;font-size:16px;font-weight:700;color:#111827;text-align:right;\">\n          ").concat(formatCurrency(Number(invoice.total), invoice.currency), "\n        </td>\n      </tr>\n\n    </table>\n  ");
}
function invoiceRSummary(receipt) {
    var _a;
    var rows = (_a = receipt.invoice) === null || _a === void 0 ? void 0 : _a.items.map(function (item) { return "\n      <tr>\n        <td style=\"padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;\">\n          ".concat(item.name, "\n        </td>\n        <td style=\"padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;\">\n          ").concat(item.quantity, " \u00D7 ").concat(formatCurrency(Number(item.rate), receipt.invoice.currency), "\n        </td>\n        <td style=\"padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;\">\n          ").concat(formatCurrency(item.quantity * Number(item.rate), receipt.invoice.currency), "\n        </td>\n      </tr>"); }).join("");
    return "\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n      style=\"border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin:24px 0;\">\n\n      <!-- Table header -->\n      <tr style=\"background-color:#f9fafb;\">\n        <th style=\"padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.5px;\">Description</th>\n        <th style=\"padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;\">Qty \u00D7 Price</th>\n        <th style=\"padding:10px 12px;font-size:11px;font-weight:600;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;\">Amount</th>\n      </tr>\n\n      <!-- Line items -->\n      <tr>\n        <td colspan=\"3\" style=\"padding:0 12px;\">\n          <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n            ".concat(rows, "\n          </table>\n        </td>\n      </tr>\n\n      <!-- Total -->\n      <tr style=\"background-color:#f9fafb;\">\n        <td colspan=\"2\" style=\"padding:12px;font-size:14px;font-weight:600;color:#111827;\">Total</td>\n        <td style=\"padding:12px;font-size:16px;font-weight:700;color:#111827;text-align:right;\">\n          ").concat(formatCurrency(Number(receipt.invoice.total), receipt.invoice.currency), "\n        </td>\n      </tr>\n\n    </table>\n  ");
}
/**
 * Format a number as currency.
 * Falls back to NGN if currency is not provided.
 */
function formatCurrency(amount, currency) {
    if (currency === void 0) { currency = "NGN"; }
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: currency }).format(amount);
}
/**
 * Format a date as "Jan 1, 2025".
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
/**
 * Renders a prominent CTA button.
 */
function ctaButton(_a) {
    var label = _a.label, href = _a.href, _b = _a.color, color = _b === void 0 ? "#18181b" : _b;
    return "\n    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:28px 0;\">\n      <tr>\n        <td style=\"border-radius:6px;background-color:".concat(color, ";\">\n          <a href=\"").concat(href, "\" target=\"_blank\"\n            style=\"display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;letter-spacing:0.1px;\">\n            ").concat(label, "\n          </a>\n        </td>\n      </tr>\n    </table>\n  ");
}
/**
 * Renders the invoice meta row (invoice #, issue date, due date).
 */
function invoiceMeta(invoice) {
    return "\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n      style=\"background-color:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;\">\n      <tr>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;\">Invoice</td>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;text-align:right;\">Issued</td>\n      </tr>\n      <tr>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;\">#".concat(invoice.invoiceNumber, "</td>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;text-align:right;\">").concat(formatDate(invoice.issued_date), "</td>\n      </tr>\n      ").concat(invoice.due_date
        ? "\n      <tr><td colspan=\"2\" style=\"padding-top:12px;\"></td></tr>\n      <tr>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;\">Due date</td>\n      </tr>\n      <tr>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;\">".concat(formatDate(invoice.due_date), "</td>\n      </tr>")
        : "", "\n    </table>\n  ");
}
/* * Renders the invoice meta row (invoice #, transaction date, recieptId).
 */
function invoiceRMeta(receipt) {
    var _a;
    return "\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n      style=\"background-color:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;\">\n      <tr>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;\">Invoice</td>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;text-align:right;\">Transaction Date</td>\n      </tr>\n      <tr>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;\">#".concat(receipt.invoice.invoiceNumber, "</td>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;text-align:right;\">").concat(formatDate(((_a = receipt.invoice) === null || _a === void 0 ? void 0 : _a.paidAt) || ""), "</td>\n      </tr>\n    \n      <tr><td colspan=\"2\" style=\"padding-top:12px;\"></td></tr>\n      <tr>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;\">Transaction Id</td>\n      </tr>\n      <tr>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;\">").concat(receipt.paymentId, "</td>\n      </tr>\n      <tr>\n        <td style=\"font-size:12px;color:#6b7280;padding-bottom:4px;\">Receipt Id</td>\n      </tr>\n      <tr>\n        <td style=\"font-size:14px;font-weight:600;color:#111827;\">").concat(receipt.id, "</td>\n      </tr>\n\t\t\n    </table>\n  ");
}
