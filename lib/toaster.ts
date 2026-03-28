import { toast as toaster } from "sonner";

export default function toast(
	message: string | null | undefined,
	type: "info" | "success" | "warning" | "error",
) {
	switch (type) {
		case "success":
			toaster.success(message, {
				style: {
					backgroundColor: "teal",
					color: "white",
				},
			});

			break;
		case "warning":
			toaster.warning(message, {
				style: {
					backgroundColor: "orange",
					color: "white",
				},
			});

			break;
		case "error":
			toaster.error(message, {
				style: {
					backgroundColor: "red",
					color: "white",
				},
			});

			break;

		default:
			toaster.info(message);

			break;
	}
}
