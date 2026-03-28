import { TooltipProvider } from "@/components/ui/tooltip";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
	title: "Invoicely",
	description:
		"Invoicely is a simple and intuitive invoicing application designed to help freelancers and small businesses manage their billing and payments with ease. With Invoicely, you can create professional invoices, track expenses, and accept online payments, all in one place. Whether you're a freelancer looking to streamline your invoicing process or a small business owner seeking an efficient billing solution, Invoicely has got you covered.",
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			{...mantineHtmlProps}
			className={cn("font-sans", inter.variable)}
		>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<TooltipProvider>
					<MantineProvider>{children}</MantineProvider>
				</TooltipProvider>
				<Toaster expand visibleToasts={9} position='top-center' />
			</body>
		</html>
	);
}
