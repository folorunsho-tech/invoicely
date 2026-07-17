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
				closeButton: true,
			});

			break;
		case "warning":
			toaster.warning(message, {
				style: {
					backgroundColor: "orange",
					color: "white",
				},
				closeButton: true,
			});

			break;
		case "error":
			toaster.error(message, {
				style: {
					backgroundColor: "red",
					color: "white",
				},
				closeButton: true,
			});

			break;

		default:
			toaster.info(message, {
				closeButton: true,
				style: {
					color: "white",
				},
			});

			break;
	}
}
