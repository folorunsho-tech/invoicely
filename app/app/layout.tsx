"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

import "@mantine/dates/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { data } = authClient.useSession();
	useEffect(() => {
		if (data && !data?.session.activeOrganizationId) {
			router.push("/auth/signin");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.session]);
	return (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar />
			<SidebarInset>
				<SiteHeader />
				<main className='p-2 px-4 bg-gray-50 h-full'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
