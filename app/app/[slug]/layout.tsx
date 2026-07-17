"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "@mantine/dates/styles.css";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar />
			<SidebarInset>
				<SiteHeader />
				<main className='p-2 px-4 bg-gray-100 h-full'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
