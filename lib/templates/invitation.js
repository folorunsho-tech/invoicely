"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationTemplate = invitationTemplate;
var base_1 = require("./base");
var helper_1 = require("./helper");
function invitationTemplate(_a) {
    var inviterName = _a.inviterName, companyName = _a.companyName, inviteUrl = _a.inviteUrl, _b = _a.expiresInDays, expiresInDays = _b === void 0 ? 2 : _b, role = _a.role;
    var content = "\n    <!-- Logo / avatar placeholder -->\n    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:28px;\">\n      <tr>\n        <td style=\"width:48px;height:48px;background-color:#18181b;border-radius:12px;text-align:center;vertical-align:middle;\">\n          <span style=\"font-size:22px;line-height:48px;color:#ffffff;font-weight:700;\">\n            ".concat(companyName.charAt(0).toUpperCase(), "\n          </span>\n        </td>\n      </tr>\n    </table>\n\n    <h1 style=\"margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;\">\n      You've been invited to join ").concat(companyName, "\n    </h1>\n    <p style=\"margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;\">\n      ").concat(inviterName, " has invited you to join <strong style=\"color:#374151;\">").concat(companyName, "</strong>\n      ").concat(role ? "as a <strong style=\"color:#374151;\">".concat(role, "</strong>") : "", ".\n    </p>\n\n    ").concat((0, helper_1.ctaButton)({ label: "Accept invitation", href: inviteUrl, color: "#18181b" }), "\n\n    <!-- Expiry notice -->\n    <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:20px;\">\n      <tr>\n        <td style=\"background-color:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;\">\n          <p style=\"margin:0;font-size:12px;color:#92400e;line-height:1.5;\">\n            \u23F3 This invitation expires in <strong>").concat(expiresInDays, " days</strong>.\n            After that, you'll need to request a new one.\n          </p>\n        </td>\n      </tr>\n    </table>\n\n    <!-- Manual link fallback -->\n    <p style=\"margin:0;font-size:12px;color:#9ca3af;line-height:1.8;\">\n      If the button above doesn't work, copy and paste this link into your browser:<br />\n      <a href=\"").concat(inviteUrl, "\" style=\"color:#6b7280;word-break:break-all;\">").concat(inviteUrl, "</a>\n    </p>\n  ");
    return {
        subject: "".concat(inviterName, " invited you to join ").concat(companyName),
        html: (0, base_1.baseLayout)({
            previewText: "".concat(inviterName, " has invited you to join ").concat(companyName, ". Accept your invitation."),
            content: content,
            companyName: companyName,
        }),
    };
}
// ─── Helper ───────────────────────────────────────────────────────────────────
// function accessItem(text: string) {
// 	return `
//     <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
//       <tr>
//         <td style="width:20px;vertical-align:top;padding-top:1px;">
//           <span style="font-size:13px;color:#16a34a;">✓</span>
//         </td>
//         <td style="font-size:13px;color:#374151;line-height:1.5;">${text}</td>
//       </tr>
//     </table>
//   `;
// }
// <!-- What they get -->
// <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//   style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:28px;">
//   <tr>
//     <td style="padding:16px 20px;">
//       <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
//         What you get access to
//       </p>
//       ${accessItem("Manage and send invoices to clients")}
//       ${accessItem("Track payments and outstanding balances")}
//       ${accessItem("Receive email notifications for invoice activity")}
//       ${role === "Admin" ? accessItem("Manage team members and settings") : ""}
//     </td>
//   </tr>
// </table>
