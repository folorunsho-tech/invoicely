"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const theme = createTheme({
	primaryColor: "violet",
});
// export const metadata = {
// 	title: "Invoicely",
// 	description:
// 		"Invoicely is a simple and intuitive invoicing application designed to help freelancers and small businesses manage their billing and payments with ease. With Invoicely, you can create professional invoices, track expenses, and accept online payments, all in one place. Whether you're a freelancer looking to streamline your invoicing process or a small business owner seeking an efficient billing solution, Invoicely has got you covered.",
// };
const client = new QueryClient();
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className={cn("h-full", "antialiased", "font-sans", inter.variable)}
		>
			<body>
				<TooltipProvider>
					<MantineProvider theme={theme}>
						<QueryClientProvider client={client}>
							{children}
						</QueryClientProvider>
					</MantineProvider>
				</TooltipProvider>
				<Toaster expand visibleToasts={9} position='top-center' />
			</body>
		</html>
	);
}
