import { baseLayout } from "./base";
import { ctaButton } from "./helper";

export function invitationTemplate({
	inviterName,
	companyName,
	inviteUrl,
	expiresInDays = 2,
	role,
}: {
	inviterName: string;
	companyName: string;
	inviteUrl: string;
	expiresInDays: number;
	role: string;
}) {
	const content = `
    <!-- Logo / avatar placeholder -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="width:48px;height:48px;background-color:#18181b;border-radius:12px;text-align:center;vertical-align:middle;">
          <span style="font-size:22px;line-height:48px;color:#ffffff;font-weight:700;">
            ${companyName.charAt(0).toUpperCase()}
          </span>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.3px;">
      You've been invited to join ${companyName}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
      ${inviterName} has invited you to join <strong style="color:#374151;">${companyName}</strong>
      ${role ? `as a <strong style="color:#374151;">${role}</strong>` : ""}.
    </p>

    ${ctaButton({ label: "Accept invitation", href: inviteUrl, color: "#18181b" })}

    <!-- Expiry notice -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;">
          <p style="margin:0;font-size:12px;color:#92400e;line-height:1.5;">
            ⏳ This invitation expires in <strong>${expiresInDays} days</strong>.
            After that, you'll need to request a new one.
          </p>
        </td>
      </tr>
    </table>

    <!-- Manual link fallback -->
    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.8;">
      If the button above doesn't work, copy and paste this link into your browser:<br />
      <a href="${inviteUrl}" style="color:#6b7280;word-break:break-all;">${inviteUrl}</a>
    </p>
  `;

	return {
		subject: `${inviterName} invited you to join ${companyName}`,
		html: baseLayout({
			previewText: `${inviterName} has invited you to join ${companyName}. Accept your invitation.`,
			content,
			companyName,
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
