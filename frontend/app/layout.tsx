import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";
export const metadata = {
	title: "Invoicely",
	description:
		"Invoicely is a simple and intuitive invoicing application designed to help freelancers and small businesses manage their billing and payments with ease. With Invoicely, you can create professional invoices, track expenses, and accept online payments, all in one place. Whether you're a freelancer looking to streamline your invoicing process or a small business owner seeking an efficient billing solution, Invoicely has got you covered.",
};
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<MantineProvider>{children}</MantineProvider>
			</body>
		</html>
	);
}
