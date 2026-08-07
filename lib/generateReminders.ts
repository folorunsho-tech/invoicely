import { sub } from "date-fns";
export const generateReminders = (
	due_date: string | Date,
	invoiceId: string,
	organizationId: string,
): {
	invoiceId: string;
	reminderType: string;
	organizationId: string;
	delay?: number;
}[] => {
	const due = new Date(due_date);
	const seven = Number(due) - Number(sub(due, { days: 7 }));
	const three = Number(due) - Number(sub(due, { days: 3 }));
	const one = Number(due) - Number(sub(due, { days: 1 }));
	return [
		{
			invoiceId,
			organizationId,
			reminderType: "REMINDER_7D",
			delay: seven,
		},
		{
			invoiceId,
			organizationId,
			reminderType: "REMINDER_3D",
			delay: three,
		},
		{
			invoiceId,
			organizationId,
			reminderType: "REMINDER_1D",
			delay: one,
		},
	];
};
